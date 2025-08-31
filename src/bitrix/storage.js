/**
 * Bitrix24 Storage Wrapper for KV operations
 * Handles authentication data storage and retrieval
 */
export class BX24Storage {
    constructor(kv) {
        this.kv = kv;
    }

    /**
     * Save authentication data for a specific domain/user
     * @param {string} domain - Bitrix24 domain
     * @param {string} userId - User ID (optional, default: 'default')
     * @param {object} authData - Authentication data
     */
    async saveAuth(domain, userId = 'default', authData) {
        const key = this._getAuthKey(domain, userId);
        const data = {
            ...authData,
            saved_at: Date.now(),
            expires_at: authData.expires_in ? Date.now() + (authData.expires_in * 1000) : null
        };

        try {
            await this.kv.put(key, JSON.stringify(data), {
                expirationTtl: authData.expires_in || 3600 // Default 1 hour
            });
            return true;
        } catch (error) {
            console.error('Failed to save auth data:', error);
            return false;
        }
    }

    /**
     * Retrieve authentication data
     * @param {string} domain - Bitrix24 domain
     * @param {string} userId - User ID
     * @returns {object|null} Authentication data or null
     */
    async getAuth(domain, userId = 'default') {
        const key = this._getAuthKey(domain, userId);
        
        try {
            const data = await this.kv.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to get auth data:', error);
            return null;
        }
    }

    /**
     * Remove authentication data
     * @param {string} domain - Bitrix24 domain
     * @param {string} userId - User ID
     */
    async removeAuth(domain, userId = 'default') {
        const key = this._getAuthKey(domain, userId);
        
        try {
            await this.kv.delete(key);
            return true;
        } catch (error) {
            console.error('Failed to remove auth data:', error);
            return false;
        }
    }

    /**
     * Save application settings (global)
     * @param {object} settings - Application settings
     */
    async saveAppSettings(settings) {
        try {
            await this.kv.put('app_settings', JSON.stringify({
                ...settings,
                updated_at: Date.now()
            }));
            return true;
        } catch (error) {
            console.error('Failed to save app settings:', error);
            return false;
        }
    }

    /**
     * Get application settings
     * @returns {object|null} Application settings or null
     */
    async getAppSettings() {
        try {
            const data = await this.kv.get('app_settings');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to get app settings:', error);
            return null;
        }
    }

    /**
     * Save error log entry
     * @param {object} errorData - Error information
     */
    async saveErrorLog(errorData) {
        const key = `error_log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        try {
            await this.kv.put(key, JSON.stringify({
                ...errorData,
                timestamp: Date.now(),
                date: new Date().toISOString()
            }), {
                expirationTtl: 86400 // 24 hours
            });
            return true;
        } catch (error) {
            console.error('Failed to save error log:', error);
            return false;
        }
    }

    /**
     * Save API analytics data
     * @param {string} method - API method called
     * @param {number} duration - Call duration in ms
     * @param {boolean} success - Whether call was successful
     * @param {string} errorCode - Error code if failed
     */
    async saveAnalytics(method, duration, success, errorCode = null) {
        const today = new Date().toISOString().split('T')[0];
        const key = `analytics_${today}`;
        
        try {
            let stats = await this.kv.get(key);
            stats = stats ? JSON.parse(stats) : {
                date: today,
                total_calls: 0,
                successful_calls: 0,
                failed_calls: 0,
                methods: {},
                errors: {},
                avg_duration: 0,
                total_duration: 0
            };

            // Update statistics
            stats.total_calls++;
            stats.total_duration += duration;
            stats.avg_duration = stats.total_duration / stats.total_calls;
            stats.methods[method] = (stats.methods[method] || 0) + 1;

            if (success) {
                stats.successful_calls++;
            } else {
                stats.failed_calls++;
                if (errorCode) {
                    stats.errors[errorCode] = (stats.errors[errorCode] || 0) + 1;
                }
            }

            await this.kv.put(key, JSON.stringify(stats), {
                expirationTtl: 86400 * 7 // Keep for 7 days
            });
            return true;
        } catch (error) {
            console.error('Failed to save analytics:', error);
            return false;
        }
    }

    /**
     * Get analytics data for a specific date
     * @param {string} date - Date in YYYY-MM-DD format (default: today)
     * @returns {object|null} Analytics data or null
     */
    async getAnalytics(date = null) {
        const targetDate = date || new Date().toISOString().split('T')[0];
        const key = `analytics_${targetDate}`;
        
        try {
            const data = await this.kv.get(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Failed to get analytics:', error);
            return null;
        }
    }

    /**
     * Generate auth storage key
     * @private
     */
    _getAuthKey(domain, userId) {
        return `bx24_auth_${domain}_${userId}`;
    }
}