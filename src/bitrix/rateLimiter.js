/**
 * Rate Limiter for Bitrix24 API calls
 * Implements 2 requests per second limit as per CRest.php
 */
export class RateLimiter {
    constructor(maxRequests = 2, timeWindow = 1000) {
        this.maxRequests = maxRequests;
        this.timeWindow = timeWindow;
        this.requests = [];
    }

    /**
     * Wait for available request slot
     * @returns {Promise<void>}
     */
    async waitForSlot() {
        const now = Date.now();
        
        // Remove old requests outside the time window
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        
        // If we're at the limit, wait for the oldest request to expire
        if (this.requests.length >= this.maxRequests) {
            const oldestRequest = this.requests[0];
            const waitTime = this.timeWindow - (now - oldestRequest);
            
            if (waitTime > 0) {
                await this._delay(waitTime);
                // Recursive call to check again after delay
                return this.waitForSlot();
            }
        }
        
        // Record this request
        this.requests.push(now);
    }

    /**
     * Get current request count in time window
     */
    getCurrentRequestCount() {
        const now = Date.now();
        this.requests = this.requests.filter(time => now - time < this.timeWindow);
        return this.requests.length;
    }

    /**
     * Check if we can make a request without waiting
     */
    canMakeRequest() {
        const now = Date.now();
        const recentRequests = this.requests.filter(time => now - time < this.timeWindow);
        return recentRequests.length < this.maxRequests;
    }

    /**
     * Reset the rate limiter
     */
    reset() {
        this.requests = [];
    }

    /**
     * Private method to delay execution
     */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

/**
 * Global rate limiter instance for Bitrix24 API
 * Shared across all client instances to ensure global limit
 */
export const globalRateLimiter = new RateLimiter(2, 1000); // 2 requests per second