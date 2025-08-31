import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Bitrix24Client } from '../../src/bitrix/client.js';
import { BX24Error } from '../../src/bitrix/errors.js';

// Mock global fetch
global.fetch = vi.fn();

describe('Bitrix24Client', () => {
  let client;
  let mockEnv;

  beforeEach(() => {
    // Mock environment
    mockEnv = {
      BITRIX_KV: {
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn()
      },
      BITRIX_CLIENT_ID: 'test-client-id',
      BITRIX_CLIENT_SECRET: 'test-client-secret'
    };

    // Mock settings
    const settings = {
      domain: 'test.bitrix24.com',
      access_token: 'test-access-token',
      refresh_token: 'test-refresh-token',
      client_endpoint: 'https://test.bitrix24.com/rest/',
      expires_in: 3600
    };

    client = new Bitrix24Client(settings, mockEnv);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with settings and env', () => {
      expect(client.settings.domain).toBe('test.bitrix24.com');
      expect(client.env).toBe(mockEnv);
    });

    it('should handle empty settings', () => {
      const emptyClient = new Bitrix24Client({}, mockEnv);
      expect(emptyClient.settings).toEqual({});
    });
  });

  describe('call method', () => {
    it('should make successful API call', async () => {
      const mockResponse = { result: { ID: '123', NAME: 'Test User' } };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await client.call('user.current');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'https://test.bitrix24.com/rest/user.current.json',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'User-Agent': 'Bitrix24 CRest JS 1.0'
          }),
          body: JSON.stringify({
            auth: 'test-access-token'
          })
        })
      );
      
      expect(result).toEqual(mockResponse);
    });

    it('should handle expired token and refresh', async () => {
      // First call returns expired token error
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: 'expired_token' })
      });

      // Mock refresh token call
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          access_token: 'new-access-token',
          refresh_token: 'new-refresh-token',
          expires_in: 3600
        })
      });

      // Second call after refresh succeeds
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ result: { ID: '123' } })
      });

      mockEnv.BITRIX_KV.put.mockResolvedValue();

      const result = await client.call('user.current');
      
      expect(global.fetch).toHaveBeenCalledTimes(3); // original call + refresh + retry
      expect(result).toEqual({ result: { ID: '123' } });
    });

    it('should handle non-retryable errors', async () => {
      const mockError = { error: 'invalid_token' };
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockError
      });

      await expect(client.call('user.current')).rejects.toThrow(BX24Error);
    });

    it('should respect max retries limit', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ error: 'INTERNAL_SERVER_ERROR' })
      });

      await expect(client.call('user.current')).rejects.toThrow(BX24Error);
      expect(global.fetch).toHaveBeenCalledTimes(Bitrix24Client.MAX_RETRIES + 1);
    });

    it('should throw error when not configured', async () => {
      const unconfiguredClient = new Bitrix24Client({}, mockEnv);
      
      await expect(unconfiguredClient.call('user.current')).rejects.toThrow(BX24Error);
    });
  });

  describe('callBatch method', () => {
    it('should process batch requests correctly', async () => {
      const mockBatchResponse = {
        result: {
          result: {
            user1: { ID: '1', NAME: 'User 1' },
            user2: { ID: '2', NAME: 'User 2' }
          }
        }
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockBatchResponse
      });

      const methods = [
        { key: 'user1', method: 'user.get', params: { ID: 1 } },
        { key: 'user2', method: 'user.get', params: { ID: 2 } }
      ];

      const results = await client.callBatch(methods);
      
      expect(results).toHaveLength(1); // Single batch
      expect(results[0]).toEqual(mockBatchResponse);
    });

    it('should split large batches correctly', async () => {
      // Create methods exceeding batch count
      const methods = Array.from({ length: 75 }, (_, i) => ({
        key: `user${i}`,
        method: 'user.get',
        params: { ID: i }
      }));

      global.fetch.mockResolvedValue({
        ok: true,
        json: async () => ({ result: { result: {} } })
      });

      await client.callBatch(methods);
      
      // Should split into 2 batches (50 + 25)
      expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    it('should handle empty batch methods', async () => {
      await expect(client.callBatch([])).rejects.toThrow(BX24Error);
      await expect(client.callBatch(null)).rejects.toThrow(BX24Error);
    });
  });

  describe('refreshToken method', () => {
    it('should successfully refresh token', async () => {
      const newTokenData = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
        expires_in: 3600
      };

      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => newTokenData
      });

      mockEnv.BITRIX_KV.put.mockResolvedValue();

      const result = await client.refreshToken();
      
      expect(result).toBe(true);
      expect(client.settings.access_token).toBe('new-access-token');
      expect(mockEnv.BITRIX_KV.put).toHaveBeenCalled();
    });

    it('should handle refresh token failure', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ error: 'invalid_grant' })
      });

      const result = await client.refreshToken();
      
      expect(result).toBe(false);
    });

    it('should handle missing refresh token', async () => {
      client.settings.refresh_token = null;
      
      const result = await client.refreshToken();
      
      expect(result).toBe(false);
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('static methods', () => {
    it('should create client from stored settings', async () => {
      const storedSettings = {
        domain: 'stored.bitrix24.com',
        access_token: 'stored-token'
      };

      mockEnv.BITRIX_KV.get.mockResolvedValue(JSON.stringify(storedSettings));

      const client = await Bitrix24Client.createFromStoredSettings(mockEnv);
      
      expect(client.settings).toEqual(storedSettings);
      expect(mockEnv.BITRIX_KV.get).toHaveBeenCalledWith('app_settings', 'json');
    });

    it('should handle missing KV binding gracefully', async () => {
      const envWithoutKV = { ...mockEnv };
      delete envWithoutKV.BITRIX_KV;

      const client = await Bitrix24Client.createFromStoredSettings(envWithoutKV);
      
      expect(client.settings).toEqual({});
    });
  });
});