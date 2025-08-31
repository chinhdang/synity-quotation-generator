
import { BX24Error, createBX24Error, delay } from './errors.js';
import { globalRateLimiter } from './rateLimiter.js';

// This client is designed for the Cloudflare Workers environment.
// It uses KV Storage to persist authentication tokens.
// Enhanced with automatic retry logic like CRest.php

export class Bitrix24Client {
  static BATCH_COUNT = 50; // Maximum batch size như CRest
  static MAX_RETRIES = 3;  // Maximum retry attempts
  /**
   * @param {object} settings - The application's auth settings.
   * @param {object} env - The worker's environment, containing secrets and KV bindings.
   */
  constructor(settings, env) {
    this.settings = settings || {};
    this.env = env || {};
  }

  /**
   * Factory method to create a client instance from settings stored in KV.
   * @param {object} env - The worker's environment.
   */
  static async createFromStoredSettings(env) {
    if (!env.BITRIX_KV) {
      // Fallback for local development where wrangler.toml might not be fully configured
      console.warn('BITRIX_KV namespace is not bound. Check wrangler.toml. Using in-memory settings for now.');
      return new Bitrix24Client({}, env);
    }
    const settings = await env.BITRIX_KV.get('app_settings', 'json');
    return new Bitrix24Client(settings, env);
  }

  /**
   * Saves the current settings to KV storage.
   * @param {object} newSettings - The new settings to merge and save.
   */
  async saveSettings(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    if (!this.env.BITRIX_KV) {
      console.error('BITRIX_KV namespace is not bound. Cannot save settings.');
      return;
    }
    await this.env.BITRIX_KV.put('app_settings', JSON.stringify(this.settings));
  }

  /**
   * Makes a call to the Bitrix24 REST API.
   * @param {string} method - The API method to call.
   * @param {object} params - Parameters for the API method.
   * @param {boolean} retry - Internal flag to prevent infinite retry loops.
   */
  async call(method, params = {}, attemptCount = 0) {
    if (!this.settings.domain || !this.settings.access_token) {
      throw new BX24Error('no_install_app', 'Client is not configured. Domain or access token is missing.');
    }

    try {
      const result = await this._makeRequest(method, params);
      
      // Success case
      if (!result.error) {
        return result;
      }

      // Handle errors with retry logic
      const bx24Error = createBX24Error(result);
      
      // Log error for debugging
      console.warn(`Bitrix24 API Error: ${bx24Error.code} - ${bx24Error.message}`);
      
      // Check if we can retry
      if (bx24Error.isRetryable() && attemptCount < Bitrix24Client.MAX_RETRIES) {
        // Handle specific retry actions
        if (bx24Error.action === 'refresh') {
          console.log('Access token expired. Refreshing...');
          const refreshed = await this.refreshToken();
          if (!refreshed) {
            throw new BX24Error('refresh_failed', 'Failed to refresh access token');
          }
          console.log('Token refreshed successfully. Retrying API call...');
        }
        
        // Wait if delay is specified
        if (bx24Error.getRetryDelay() > 0) {
          await delay(bx24Error.getRetryDelay());
        }
        
        // Retry the request
        return this.call(method, params, attemptCount + 1);
      }
      
      // Cannot retry, throw the error
      throw bx24Error;
      
    } catch (error) {
      if (error instanceof BX24Error) {
        throw error;
      }
      
      // Handle network/fetch errors
      if (attemptCount < Bitrix24Client.MAX_RETRIES) {
        console.warn(`Network error, retrying... (${attemptCount + 1}/${Bitrix24Client.MAX_RETRIES})`);
        await delay(1000); // Wait 1 second on network errors
        return this.call(method, params, attemptCount + 1);
      }
      
      throw new BX24Error('network_error', 'Network request failed', error);
    }
  }

  /**
   * Internal method to make the actual HTTP request
   */
  async _makeRequest(method, params) {
    // Apply rate limiting (2 requests per second như CRest.php)
    await globalRateLimiter.waitForSlot();
    
    const apiUrl = `${this.settings.client_endpoint}${method}.json`;
    const body = JSON.stringify({
      ...params,
      auth: this.settings.access_token,
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'User-Agent': 'Bitrix24 CRest JS 1.0' // Giống CRest.php
      },
      body: body,
    });

    if (!response.ok) {
      throw new BX24Error('http_error', `HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  }

  /**
   * Execute multiple API calls in batches (like CRest::callBatch)
   * @param {Array} methods - Array of method objects: [{key: 'method1', method: 'user.get', params: {...}}, ...]
   * @param {boolean} halt - Stop on first error (default: false)
   * @returns {Promise<Array>} Array of batch results
   */
  async callBatch(methods, halt = false) {
    if (!Array.isArray(methods) || methods.length === 0) {
      throw new BX24Error('invalid_batch', 'Invalid batch methods: expected non-empty array');
    }

    const batches = this._chunkMethods(methods, Bitrix24Client.BATCH_COUNT);
    const results = [];

    for (const batch of batches) {
      try {
        const batchData = this._prepareBatchData(batch, halt);
        const batchResult = await this.call('batch', batchData);
        results.push(batchResult);

        // Rate limiting between batches (như CRest có delay)
        if (batches.length > 1) {
          await delay(500); // 0.5s delay between batches
        }
      } catch (error) {
        if (halt) {
          throw error;
        }
        // Continue with next batch if halt=false
        results.push({ error: error.code || 'batch_error', error_description: error.message });
      }
    }

    return results;
  }

  /**
   * Split methods array into chunks of specified size
   */
  _chunkMethods(methods, chunkSize) {
    const chunks = [];
    for (let i = 0; i < methods.length; i += chunkSize) {
      chunks.push(methods.slice(i, i + chunkSize));
    }
    return chunks;
  }

  /**
   * Prepare batch data in Bitrix24 format
   */
  _prepareBatchData(methods, halt) {
    const batchData = {
      cmd: {},
      halt: halt ? 1 : 0
    };

    methods.forEach((item, index) => {
      const key = item.key || `method_${index}`;
      let methodCall = item.method;

      // Add parameters as query string (như CRest.php)
      if (item.params && Object.keys(item.params).length > 0) {
        const queryParams = new URLSearchParams();
        Object.entries(item.params).forEach(([paramKey, paramValue]) => {
          if (typeof paramValue === 'object') {
            queryParams.append(paramKey, JSON.stringify(paramValue));
          } else {
            queryParams.append(paramKey, paramValue);
          }
        });
        methodCall += '?' + queryParams.toString();
      }

      batchData.cmd[key] = methodCall;
    });

    return batchData;
  }

  /**
   * Refreshes the access token using the refresh token.
   */
  async refreshToken() {
    if (!this.settings.refresh_token) {
      console.error('No refresh token available.');
      return false;
    }

    const clientId = this.env.BITRIX_CLIENT_ID;
    const clientSecret = this.env.BITRIX_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.error('BITRIX_CLIENT_ID or BITRIX_CLIENT_SECRET are not configured in worker secrets.');
        return false;
    }

    const queryParams = new URLSearchParams({
      grant_type: 'refresh_token',
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: this.settings.refresh_token,
    });

    const refreshUrl = `https://oauth.bitrix.info/oauth/token/?${queryParams.toString()}`;

    try {
      const response = await fetch(refreshUrl);
      const data = await response.json();

      if (data.error) {
        console.error('Failed to refresh token:', data.error_description);
        return false;
      }

      const newAuth = {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_in: data.expires_in,
      };

      await this.saveSettings(newAuth);
      console.log('Successfully refreshed and saved new tokens.');
      return true;
    } catch (error) {
      console.error('Exception during token refresh:', error);
      return false;
    }
  }
}
