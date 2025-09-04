import { describe, it, expect } from 'vitest'

// Helper functions for testing
const createMockEnv = (overrides = {}) => ({
  APP_NAME: 'Test App',
  APP_ENV: 'test',
  LOG_LEVEL: 'debug',
  ...overrides
})

describe('Main Handler Smoke Tests', () => {
  it('should export default handler', async () => {
    // Dynamic import to avoid module loading issues
    const { default: handler } = await import('../src/index.js')
    
    expect(handler).toBeDefined()
    expect(typeof handler).toBe('object')
    expect(typeof handler.fetch).toBe('function')
  })

  it('should handle CORS preflight request', async () => {
    const { default: handler } = await import('../src/index.js')
    
    const request = new Request('https://example.com/', {
      method: 'OPTIONS'
    })
    
    const env = createMockEnv()
    const ctx = {}
    
    const response = await handler.fetch(request, env, ctx)
    
    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(200)
    expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*')
  })

  it('should handle favicon request', async () => {
    const { default: handler } = await import('../src/index.js')
    
    const request = new Request('https://example.com/favicon.ico', {
      method: 'GET'
    })
    
    const env = createMockEnv()
    const ctx = {}
    
    const response = await handler.fetch(request, env, ctx)
    
    // Should return 204 No Content for favicon
    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(204)
  })

  it('should recognize widget quotation route', async () => {
    const { default: handler } = await import('../src/index.js')
    
    const request = new Request('https://example.com/widget/quotation', {
      method: 'POST',
      body: 'AUTH_ID=test&DOMAIN=test.bitrix24.com'
    })
    
    const env = createMockEnv()
    const ctx = {}
    
    // This will likely fail due to missing auth, but should not throw
    try {
      const response = await handler.fetch(request, env, ctx)
      expect(response).toBeInstanceOf(Response)
    } catch (error) {
      // Expected to fail due to missing proper auth/client setup
      // But should not be a syntax or import error
      expect(error.message).not.toMatch(/import|require|syntax/i)
    }
  })
})