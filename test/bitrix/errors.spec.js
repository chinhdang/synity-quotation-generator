import { describe, it, expect } from 'vitest';
import { BX24Error, BX24_ERRORS, createBX24Error, delay } from '../../src/bitrix/errors.js';

describe('BX24Error', () => {
  describe('constructor', () => {
    it('should create error with known error code', () => {
      const error = new BX24Error('expired_token');
      
      expect(error.name).toBe('BX24Error');
      expect(error.code).toBe('expired_token');
      expect(error.message).toBe('Access token expired, attempting automatic refresh');
      expect(error.canRetry).toBe(true);
      expect(error.action).toBe('refresh');
      expect(error.delay).toBe(0);
    });

    it('should create error with custom description', () => {
      const customMessage = 'Custom error message';
      const error = new BX24Error('expired_token', customMessage);
      
      expect(error.message).toBe(customMessage);
      expect(error.code).toBe('expired_token');
    });

    it('should create error with unknown code', () => {
      const error = new BX24Error('unknown_error');
      
      expect(error.code).toBe('unknown_error');
      expect(error.message).toBe('Bitrix24 API Error: unknown_error');
      expect(error.canRetry).toBe(false);
      expect(error.action).toBe('unknown');
    });

    it('should preserve original error', () => {
      const originalError = new Error('Network error');
      const error = new BX24Error('network_error', null, originalError);
      
      expect(error.originalError).toBe(originalError);
    });
  });

  describe('methods', () => {
    it('should correctly identify retryable errors', () => {
      const retryableError = new BX24Error('expired_token');
      const nonRetryableError = new BX24Error('invalid_token');
      
      expect(retryableError.isRetryable()).toBe(true);
      expect(nonRetryableError.isRetryable()).toBe(false);
    });

    it('should return correct retry delay', () => {
      const quickRetry = new BX24Error('expired_token');
      const delayedRetry = new BX24Error('QUERY_LIMIT_EXCEEDED');
      
      expect(quickRetry.getRetryDelay()).toBe(0);
      expect(delayedRetry.getRetryDelay()).toBe(500);
    });

    it('should return recommended action', () => {
      const refreshError = new BX24Error('expired_token');
      const reinstallError = new BX24Error('invalid_token');
      
      expect(refreshError.getRecommendedAction()).toBe('refresh');
      expect(reinstallError.getRecommendedAction()).toBe('reinstall');
    });

    it('should serialize to JSON correctly', () => {
      const error = new BX24Error('expired_token');
      const json = error.toJSON();
      
      expect(json).toMatchObject({
        name: 'BX24Error',
        code: 'expired_token',
        message: error.message,
        canRetry: true,
        action: 'refresh',
        delay: 0
      });
      expect(json.stack).toBeDefined();
    });
  });
});

describe('createBX24Error', () => {
  it('should create error from object response', () => {
    const response = {
      error: 'expired_token',
      error_description: 'Token has expired'
    };
    
    const error = createBX24Error(response);
    
    expect(error).toBeInstanceOf(BX24Error);
    expect(error.code).toBe('expired_token');
    expect(error.message).toBe('Token has expired');
  });

  it('should create error from string response', () => {
    const error = createBX24Error('QUERY_LIMIT_EXCEEDED');
    
    expect(error).toBeInstanceOf(BX24Error);
    expect(error.code).toBe('QUERY_LIMIT_EXCEEDED');
  });

  it('should handle unknown response format', () => {
    const error = createBX24Error(123);
    
    expect(error).toBeInstanceOf(BX24Error);
    expect(error.code).toBe('unknown_error');
  });
});

describe('BX24_ERRORS', () => {
  it('should contain all expected error definitions', () => {
    const expectedErrors = [
      'expired_token',
      'invalid_token', 
      'invalid_grant',
      'invalid_client',
      'QUERY_LIMIT_EXCEEDED',
      'ERROR_METHOD_NOT_FOUND',
      'NO_AUTH_FOUND',
      'INTERNAL_SERVER_ERROR',
      'error_php_lib_curl'
    ];
    
    expectedErrors.forEach(errorCode => {
      expect(BX24_ERRORS[errorCode]).toBeDefined();
      expect(BX24_ERRORS[errorCode]).toHaveProperty('retry');
      expect(BX24_ERRORS[errorCode]).toHaveProperty('action');
      expect(BX24_ERRORS[errorCode]).toHaveProperty('description');
      expect(BX24_ERRORS[errorCode]).toHaveProperty('delay');
    });
  });

  it('should have correct retry configuration', () => {
    expect(BX24_ERRORS['expired_token'].retry).toBe(true);
    expect(BX24_ERRORS['invalid_token'].retry).toBe(false);
    expect(BX24_ERRORS['QUERY_LIMIT_EXCEEDED'].retry).toBe(true);
  });

  it('should have appropriate delays', () => {
    expect(BX24_ERRORS['QUERY_LIMIT_EXCEEDED'].delay).toBe(500);
    expect(BX24_ERRORS['INTERNAL_SERVER_ERROR'].delay).toBe(1000);
    expect(BX24_ERRORS['expired_token'].delay).toBe(0);
  });
});

describe('delay function', () => {
  it('should delay execution', async () => {
    const startTime = Date.now();
    await delay(100);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeGreaterThanOrEqual(90); // Account for timing variations
  });

  it('should handle zero delay', async () => {
    const startTime = Date.now();
    await delay(0);
    const endTime = Date.now();
    
    expect(endTime - startTime).toBeLessThan(10);
  });
});