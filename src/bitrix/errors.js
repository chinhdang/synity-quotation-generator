/**
 * Bitrix24 Error Definitions - tương đương với CRest.php error handling
 * @version 1.0.0
 */

export const BX24_ERRORS = {
    'expired_token': {
        retry: true,
        action: 'refresh',
        description: 'Access token expired, attempting automatic refresh',
        delay: 0
    },
    'invalid_token': {
        retry: false,
        action: 'reinstall',
        description: 'Invalid token, application needs reinstallation',
        delay: 0
    },
    'invalid_grant': {
        retry: false,
        action: 'check_credentials',
        description: 'Invalid grant, check CLIENT_ID and CLIENT_SECRET configuration',
        delay: 0
    },
    'invalid_client': {
        retry: false,
        action: 'check_credentials', 
        description: 'Invalid client, check CLIENT_ID and CLIENT_SECRET configuration',
        delay: 0
    },
    'QUERY_LIMIT_EXCEEDED': {
        retry: true,
        action: 'wait',
        description: 'Rate limit exceeded, maximum 2 requests per second',
        delay: 500
    },
    'ERROR_METHOD_NOT_FOUND': {
        retry: false,
        action: 'check_permissions',
        description: 'Method not found! Check application permissions with scope method',
        delay: 0
    },
    'NO_AUTH_FOUND': {
        retry: false,
        action: 'reinstall',
        description: 'Authentication setup error, check Bitrix24 module configuration',
        delay: 0
    },
    'INTERNAL_SERVER_ERROR': {
        retry: true,
        action: 'wait',
        description: 'Server temporarily unavailable, retrying after delay',
        delay: 1000
    },
    'error_php_lib_curl': {
        retry: false,
        action: 'system_check',
        description: 'HTTP client error, check network connectivity',
        delay: 0
    }
};

/**
 * Custom error class for Bitrix24 API errors
 */
export class BX24Error extends Error {
    constructor(code, description = null, originalError = null) {
        const errorInfo = BX24_ERRORS[code];
        const message = description || errorInfo?.description || `Bitrix24 API Error: ${code}`;
        
        super(message);
        this.name = 'BX24Error';
        this.code = code;
        this.canRetry = errorInfo?.retry || false;
        this.action = errorInfo?.action || 'unknown';
        this.delay = errorInfo?.delay || 0;
        this.originalError = originalError;
    }

    /**
     * Check if this error can be retried
     */
    isRetryable() {
        return this.canRetry;
    }

    /**
     * Get recommended delay before retry (ms)
     */
    getRetryDelay() {
        return this.delay;
    }

    /**
     * Get recommended action for this error
     */
    getRecommendedAction() {
        return this.action;
    }

    /**
     * Convert to JSON for logging
     */
    toJSON() {
        return {
            name: this.name,
            code: this.code,
            message: this.message,
            canRetry: this.canRetry,
            action: this.action,
            delay: this.delay,
            stack: this.stack
        };
    }
}

/**
 * Create appropriate error from Bitrix24 API response
 */
export function createBX24Error(response, originalError = null) {
    if (typeof response === 'object' && response.error) {
        return new BX24Error(response.error, response.error_description, originalError);
    }
    
    if (typeof response === 'string') {
        return new BX24Error(response, null, originalError);
    }
    
    return new BX24Error('unknown_error', 'Unknown Bitrix24 API error', originalError);
}

/**
 * Utility function to delay execution
 */
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}