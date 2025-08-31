import { describe, it, expect, beforeEach } from 'vitest';

// Mock environment for testing
const createMockEnv = () => ({
  BITRIX_KV: {
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  },
  ASSETS: {
    fetch: vi.fn()
  },
  APP_NAME: 'Test Bitrix24 App'
});

describe('Worker Integration Tests', () => {
  let env;

  beforeEach(() => {
    env = createMockEnv();
  });

  describe('CORS handling', () => {
    it('should handle OPTIONS preflight requests', async () => {
      const request = new Request('https://example.com/api/test', {
        method: 'OPTIONS'
      });

      // Import worker here to avoid issues with ES modules
      const worker = await import('../../src/index.js');
      const response = await worker.default.fetch(request, env, {});

      expect(response.status).toBe(200);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
      expect(response.headers.get('Access-Control-Allow-Methods')).toContain('POST');
    });
  });

  describe('Health check endpoints', () => {
    it('should respond to health check', async () => {
      const request = new Request('https://example.com/api/health', {
        method: 'GET'
      });

      const worker = await import('../../src/index.js');
      const response = await worker.default.fetch(request, env, {});

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('version');
      expect(data).toHaveProperty('checks');
    });

    it('should respond to quick health check', async () => {
      const request = new Request('https://example.com/api/health/quick', {
        method: 'GET'
      });

      const worker = await import('../../src/index.js');
      const response = await worker.default.fetch(request, env, {});

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('status');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('kv_available');
    });
  });

  describe('API endpoints', () => {
    it('should handle /api/message', async () => {
      const request = new Request('https://example.com/api/message', {
        method: 'GET'
      });

      const worker = await import('../../src/index.js');
      const response = await worker.default.fetch(request, env, {});

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('message');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('appName');
    });

    it('should handle /api/random', async () => {
      const request = new Request('https://example.com/api/random', {
        method: 'GET'
      });

      const worker = await import('../../src/index.js');
      const response = await worker.default.fetch(request, env, {});

      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('uuid');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('random');
      
      // UUID format validation
      expect(data.uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('should return 404 for unknown API routes', async () => {
      const request = new Request('https://example.com/api/nonexistent', {
        method: 'GET'
      });

      const worker = await import('../../src/index.js');
      const response = await worker.default.fetch(request, env, {});

      expect(response.status).toBe(404);
      
      const data = await response.json();
      expect(data).toHaveProperty('error');
      expect(data.error).toBe('API endpoint not found');
    });
  });

  describe('Bitrix24 app installation', () => {
    it('should handle installation request', async () => {
      const formData = new FormData();
      formData.append('AUTH_ID', 'test-auth-id');
      formData.append('DOMAIN', 'test.bitrix24.com');
      formData.append('REFRESH_ID', 'test-refresh-token');
      formData.append('APP_SID', 'test-app-sid');

      const request = new Request('https://example.com/install', {
        method: 'POST',
        body: formData
      });

      env.BITRIX_KV.put.mockResolvedValue();

      const worker = await import('../../src/index.js');
      const response = await worker.default.fetch(request, env, {});

      expect(response.status).toBe(200);
      expect(response.headers.get('Content-Type')).toBe('text/html');
      
      const html = await response.text();
      expect(html).toContain('BX24.installFinish');
      expect(env.BITRIX_KV.put).toHaveBeenCalled();
    });

    it('should handle installation with invalid data', async () => {
      const formData = new FormData();
      formData.append('INVALID', 'invalid-data');

      const request = new Request('https://example.com/install', {
        method: 'POST',
        body: formData
      });

      const worker = await import('../../src/index.js');
      const response = await worker.default.fetch(request, env, {});

      expect(response.status).toBe(400);
    });
  });

  describe('Static file serving', () => {
    it('should serve static files for GET requests', async () => {
      const mockHtml = '<html><body>Test</body></html>';
      env.ASSETS.fetch.mockResolvedValue(new Response(mockHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }));

      const request = new Request('https://example.com/', {
        method: 'GET'
      });

      const worker = await import('../../src/index.js');
      const response = await worker.default.fetch(request, env, {});

      expect(response.status).toBe(200);
      expect(env.ASSETS.fetch).toHaveBeenCalled();
      
      const html = await response.text();
      expect(html).toBe(mockHtml);
    });

    it('should convert POST to GET for Bitrix24 iframe requests', async () => {
      const mockHtml = '<html><body>App</body></html>';
      env.ASSETS.fetch.mockResolvedValue(new Response(mockHtml, {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      }));

      const request = new Request('https://example.com/?DOMAIN=test.bitrix24.com', {
        method: 'POST'
      });

      const worker = await import('../../src/index.js');
      const response = await worker.default.fetch(request, env, {});

      expect(response.status).toBe(200);
      expect(env.ASSETS.fetch).toHaveBeenCalled();
      
      // Should have converted POST to GET
      const assetRequest = env.ASSETS.fetch.mock.calls[0][0];
      expect(assetRequest.method).toBe('GET');
    });
  });
});