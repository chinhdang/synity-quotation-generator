
// This client is designed for the Cloudflare Workers environment.
// It uses KV Storage to persist authentication tokens.

export class Bitrix24Client {
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
  async call(method, params = {}, retry = true) {
    if (!this.settings.domain || !this.settings.access_token) {
      throw new Error('Client is not configured. Domain or access token is missing.');
    }

    const apiUrl = `${this.settings.client_endpoint}${method}.json`;
    const body = JSON.stringify({
      ...params,
      auth: this.settings.access_token,
    });

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    });

    const data = await response.json();

    if (data.error === 'expired_token' && retry) {
      console.log('Access token expired. Refreshing...');
      const refreshed = await this.refreshToken();
      if (refreshed) {
        console.log('Token refreshed successfully. Retrying API call...');
        return this.call(method, params, false); // Retry only once
      } else {
        throw new Error('Failed to refresh token.');
      }
    }
    return data;
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
