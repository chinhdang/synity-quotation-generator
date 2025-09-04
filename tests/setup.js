// Test setup for Cloudflare Workers environment
// This file runs before each test suite

import { vi } from 'vitest'

// Mock Cloudflare Workers globals that might be needed
globalThis.crypto = {
  randomUUID: () => '123e4567-e89b-12d3-a456-426614174000'
}

// Mock console methods to avoid noise in tests (optional)
// globalThis.console = {
//   log: vi.fn(),
//   error: vi.fn(),
//   warn: vi.fn(),
//   info: vi.fn()
// }

// Set up any global test utilities here
globalThis.testHelpers = {
  createMockRequest: (url = 'https://example.com/', options = {}) => {
    return new Request(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      ...options
    })
  },
  
  createMockEnv: (overrides = {}) => {
    return {
      APP_NAME: 'Test App',
      APP_ENV: 'test',
      LOG_LEVEL: 'debug',
      ...overrides
    }
  }
}