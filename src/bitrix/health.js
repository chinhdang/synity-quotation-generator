import { BX24Storage } from './storage.js';
import { globalRateLimiter } from './rateLimiter.js';

/**
 * Health Check System for Bitrix24 Worker
 */
export class HealthChecker {
    constructor(env) {
        this.env = env;
        this.storage = new BX24Storage(env.BITRIX_KV);
    }

    /**
     * Perform comprehensive health check
     * @returns {object} Health check results
     */
    async performCheck() {
        const checks = {
            timestamp: new Date().toISOString(),
            status: 'healthy',
            version: '1.0.0',
            uptime: this._getUptime(),
            checks: {
                kv_storage: await this._checkKVStorage(),
                rate_limiter: this._checkRateLimiter(),
                environment: this._checkEnvironment(),
                bitrix_connectivity: await this._checkBitrixConnectivity()
            }
        };

        // Determine overall status
        const failedChecks = Object.values(checks.checks).filter(check => check.status === 'error');
        if (failedChecks.length > 0) {
            checks.status = failedChecks.length === Object.keys(checks.checks).length ? 'critical' : 'degraded';
        }

        return checks;
    }

    /**
     * Quick health check (minimal overhead)
     * @returns {object} Basic health status
     */
    async quickCheck() {
        return {
            timestamp: new Date().toISOString(),
            status: 'healthy',
            version: '1.0.0',
            uptime: this._getUptime(),
            kv_available: !!this.env.BITRIX_KV
        };
    }

    /**
     * Check KV storage functionality
     * @private
     */
    async _checkKVStorage() {
        const check = {
            status: 'healthy',
            message: 'KV storage is operational',
            response_time: null
        };

        if (!this.env.BITRIX_KV) {
            return {
                status: 'error',
                message: 'BITRIX_KV namespace not available',
                response_time: null
            };
        }

        try {
            const startTime = Date.now();
            const testKey = 'health_check_test';
            const testValue = { timestamp: Date.now(), test: true };

            // Test write
            await this.env.BITRIX_KV.put(testKey, JSON.stringify(testValue), { expirationTtl: 60 });
            
            // Test read
            const retrieved = await this.env.BITRIX_KV.get(testKey);
            const parsedValue = JSON.parse(retrieved);

            // Test delete
            await this.env.BITRIX_KV.delete(testKey);

            check.response_time = Date.now() - startTime;

            if (!parsedValue || parsedValue.timestamp !== testValue.timestamp) {
                check.status = 'error';
                check.message = 'KV storage read/write verification failed';
            }
        } catch (error) {
            check.status = 'error';
            check.message = `KV storage error: ${error.message}`;
        }

        return check;
    }

    /**
     * Check rate limiter functionality
     * @private
     */
    _checkRateLimiter() {
        try {
            const currentCount = globalRateLimiter.getCurrentRequestCount();
            const canMakeRequest = globalRateLimiter.canMakeRequest();

            return {
                status: 'healthy',
                message: 'Rate limiter operational',
                current_requests: currentCount,
                can_make_request: canMakeRequest
            };
        } catch (error) {
            return {
                status: 'error',
                message: `Rate limiter error: ${error.message}`
            };
        }
    }

    /**
     * Check environment configuration
     * @private
     */
    _checkEnvironment() {
        const check = {
            status: 'healthy',
            message: 'Environment properly configured',
            bindings: {
                BITRIX_KV: !!this.env.BITRIX_KV,
                APP_NAME: !!this.env.APP_NAME,
                ASSETS: !!this.env.ASSETS
            },
            missing_bindings: []
        };

        // Check for required bindings
        if (!this.env.BITRIX_KV) {
            check.missing_bindings.push('BITRIX_KV');
        }
        if (!this.env.ASSETS) {
            check.missing_bindings.push('ASSETS');
        }

        if (check.missing_bindings.length > 0) {
            check.status = 'warning';
            check.message = `Missing bindings: ${check.missing_bindings.join(', ')}`;
        }

        return check;
    }

    /**
     * Test connectivity to Bitrix24 OAuth endpoint
     * @private
     */
    async _checkBitrixConnectivity() {
        const check = {
            status: 'healthy',
            message: 'Bitrix24 services reachable',
            response_time: null
        };

        try {
            const startTime = Date.now();
            
            // Test connectivity to Bitrix24 OAuth endpoint
            const response = await fetch('https://oauth.bitrix.info/oauth/token/', {
                method: 'HEAD',
                signal: AbortSignal.timeout(5000) // 5 second timeout
            });

            check.response_time = Date.now() - startTime;

            if (!response.ok && response.status !== 405) { // 405 is expected for HEAD on this endpoint
                check.status = 'warning';
                check.message = `Bitrix24 OAuth returned ${response.status}`;
            }
        } catch (error) {
            check.status = 'error';
            check.message = `Cannot reach Bitrix24 services: ${error.message}`;
        }

        return check;
    }

    /**
     * Get worker uptime (approximation)
     * @private
     */
    _getUptime() {
        // In Workers environment, this is per-request, so we return startup time
        return Date.now() - (global.workerStartTime || Date.now());
    }
}

/**
 * Export helper function for health check endpoint
 */
export async function healthCheck(env) {
    const checker = new HealthChecker(env);
    return await checker.performCheck();
}

/**
 * Export helper function for quick health check
 */
export async function quickHealthCheck(env) {
    const checker = new HealthChecker(env);
    return await checker.quickCheck();
}