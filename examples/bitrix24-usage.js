/**
 * Bitrix24Client Usage Examples
 * Demonstrates how to use the enhanced Bitrix24 client in your Worker
 */

// Import the client
import { Bitrix24Client } from '../src/bitrix/client.js';
import { BX24Storage } from '../src/bitrix/storage.js';

/**
 * Example 1: Basic API calls
 */
export async function basicApiExample(env) {
    try {
        // Create client from stored settings
        const client = await Bitrix24Client.createFromStoredSettings(env);
        
        // Simple API call
        const currentUser = await client.call('user.current');
        console.log('Current user:', currentUser.result);
        
        // API call with parameters
        const users = await client.call('user.get', {
            filter: { ACTIVE: 'Y' },
            select: ['ID', 'NAME', 'LAST_NAME', 'EMAIL']
        });
        console.log('Users:', users.result);
        
    } catch (error) {
        console.error('API call failed:', error.message);
        console.error('Error code:', error.code);
        console.error('Can retry:', error.isRetryable());
    }
}

/**
 * Example 2: Batch processing
 */
export async function batchProcessingExample(env) {
    try {
        const client = await Bitrix24Client.createFromStoredSettings(env);
        
        // Prepare batch methods
        const methods = [
            {
                key: 'current_user',
                method: 'user.current'
            },
            {
                key: 'user_fields',
                method: 'user.fields'
            },
            {
                key: 'company_list', 
                method: 'crm.company.list',
                params: { 
                    select: ['ID', 'TITLE'],
                    filter: { 'CATEGORY_ID': 0 },
                    start: 0,
                    order: { 'DATE_CREATE': 'DESC' }
                }
            }
        ];
        
        // Execute batch
        const batchResults = await client.callBatch(methods, true); // halt on error
        
        console.log('Batch results:', batchResults);
        
        // Process results
        batchResults.forEach(batchResult => {
            if (batchResult.result && batchResult.result.result) {
                const results = batchResult.result.result;
                
                if (results.current_user) {
                    console.log('Current user from batch:', results.current_user);
                }
                
                if (results.company_list) {
                    console.log('Companies:', results.company_list);
                }
            }
        });
        
    } catch (error) {
        console.error('Batch processing failed:', error.message);
    }
}

/**
 * Example 3: Error handling and retries
 */
export async function errorHandlingExample(env) {
    const client = await Bitrix24Client.createFromStoredSettings(env);
    
    try {
        // This might fail due to permissions
        const result = await client.call('user.admin', { ID: 1 });
        console.log('Admin check result:', result);
        
    } catch (error) {
        if (error.code === 'ERROR_METHOD_NOT_FOUND') {
            console.log('Method not found - check app permissions');
            console.log('Recommended action:', error.getRecommendedAction());
        } else if (error.code === 'QUERY_LIMIT_EXCEEDED') {
            console.log('Rate limited - client will automatically retry');
            console.log('Retry delay:', error.getRetryDelay());
        } else {
            console.error('Unexpected error:', error.toJSON());
        }
    }
}

/**
 * Example 4: Working with storage
 */
export async function storageExample(env) {
    const storage = new BX24Storage(env.BITRIX_KV);
    
    try {
        // Save user-specific auth data
        const authData = {
            access_token: 'user-token',
            refresh_token: 'user-refresh',
            expires_in: 3600,
            domain: 'company.bitrix24.com'
        };
        
        await storage.saveAuth('company.bitrix24.com', 'user123', authData);
        
        // Retrieve auth data
        const retrievedAuth = await storage.getAuth('company.bitrix24.com', 'user123');
        console.log('Retrieved auth:', retrievedAuth);
        
        // Save analytics
        await storage.saveAnalytics('user.current', 250, true);
        await storage.saveAnalytics('crm.deal.list', 1200, false, 'QUERY_LIMIT_EXCEEDED');
        
        // Get today's analytics
        const analytics = await storage.getAnalytics();
        console.log('Today\'s API usage:', analytics);
        
    } catch (error) {
        console.error('Storage operation failed:', error);
    }
}

/**
 * Example 5: Complete workflow - CRM data processing
 */
export async function crmWorkflowExample(env) {
    try {
        const client = await Bitrix24Client.createFromStoredSettings(env);
        const storage = new BX24Storage(env.BITRIX_KV);
        
        // Step 1: Get current user
        const currentUser = await client.call('user.current');
        const userId = currentUser.result.ID;
        
        // Step 2: Get user's deals using batch
        const dealMethods = [
            {
                key: 'active_deals',
                method: 'crm.deal.list',
                params: {
                    filter: { 
                        'ASSIGNED_BY_ID': userId,
                        'STAGE_ID': 'NEW'
                    },
                    select: ['ID', 'TITLE', 'OPPORTUNITY', 'CURRENCY_ID'],
                    order: { 'DATE_CREATE': 'DESC' }
                }
            },
            {
                key: 'won_deals_count',
                method: 'crm.deal.list',
                params: {
                    filter: { 
                        'ASSIGNED_BY_ID': userId,
                        'STAGE_ID': 'WON'
                    },
                    select: ['ID']
                }
            }
        ];
        
        const batchResults = await client.callBatch(dealMethods);
        const results = batchResults[0].result.result;
        
        // Step 3: Process and save statistics
        const userStats = {
            user_id: userId,
            user_name: `${currentUser.result.NAME} ${currentUser.result.LAST_NAME}`,
            active_deals: results.active_deals?.length || 0,
            won_deals: results.won_deals_count?.length || 0,
            total_opportunity: results.active_deals?.reduce((sum, deal) => 
                sum + parseFloat(deal.OPPORTUNITY || 0), 0) || 0,
            updated_at: new Date().toISOString()
        };
        
        // Save to KV storage
        await env.BITRIX_KV.put(
            `user_stats_${userId}`, 
            JSON.stringify(userStats),
            { expirationTtl: 3600 } // 1 hour
        );
        
        console.log('User CRM statistics:', userStats);
        
        // Log analytics
        await storage.saveAnalytics('crm.deal.list', 500, true);
        
        return userStats;
        
    } catch (error) {
        console.error('CRM workflow failed:', error);
        
        // Save error log
        const storage = new BX24Storage(env.BITRIX_KV);
        await storage.saveErrorLog({
            error_code: error.code,
            error_message: error.message,
            workflow: 'crm_processing',
            user_agent: 'Bitrix24 CRest JS 1.0'
        });
        
        throw error;
    }
}

/**
 * Example 6: Rate limiting awareness
 */
export async function rateLimitingExample(env) {
    const client = await Bitrix24Client.createFromStoredSettings(env);
    
    console.log('Making multiple API calls - rate limiting will be applied automatically');
    
    const startTime = Date.now();
    const promises = [];
    
    // Make 5 concurrent calls - rate limiter will handle the 2 req/s limit
    for (let i = 0; i < 5; i++) {
        promises.push(
            client.call('user.current').then(result => {
                console.log(`Call ${i + 1} completed at ${Date.now() - startTime}ms`);
                return result;
            })
        );
    }
    
    await Promise.all(promises);
    console.log(`All calls completed in ${Date.now() - startTime}ms`);
}

// Export all examples
export const examples = {
    basicApiExample,
    batchProcessingExample,
    errorHandlingExample,
    storageExample,
    crmWorkflowExample,
    rateLimitingExample
};