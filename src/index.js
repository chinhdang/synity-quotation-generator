/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// Cloudflare Worker cho Bitrix24 App

import { installHandler, indexHandler, widgetQuotationHandler, debugPlacementsHandler, uninstallHandler, widgetListHandler } from './bitrix/handlers.js';
import { healthCheck, quickHealthCheck } from './bitrix/health.js';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        // Environment detection
        const isDevEnvironment = env.APP_ENV === 'development';
        const envPrefix = isDevEnvironment ? '[DEV]' : '[PROD]';
        const logLevel = env.LOG_LEVEL || 'info';
        
        // Environment-aware logging
        if (isDevEnvironment || logLevel === 'debug') {
            console.log(`${envPrefix} 🚀 WORKER REQUEST:`, {
                environment: env.APP_ENV,
                appName: env.APP_NAME,
                url: request.url,
                method: request.method,
                pathname: url.pathname,
                userAgent: request.headers.get('user-agent'),
                referer: request.headers.get('referer'),
                timestamp: new Date().toISOString()
            });
        } else {
            // Production: minimal logging
            console.log(`${envPrefix} Request: ${request.method} ${url.pathname}`);
        }

        // --- ROUTER ---
        // The main router logic to dispatch requests to the correct handler.

        // 1. Handle CORS preflight requests
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Bitrix-Signature',
                    'Access-Control-Max-Age': '86400',
                }
            });
        }

        // 2. Handle Bitrix24 App Installation
        if (url.pathname === '/install' && request.method === 'POST') {
            return installHandler({ req: request, env, ctx });
        }

        // 2.5. Handle Widget Quotation Endpoint (support both GET and POST)
        if (url.pathname === '/widget/quotation') {
            console.log('🎯 WIDGET QUOTATION REQUEST:', {
                pathname: url.pathname,
                method: request.method,
                queryParams: Object.fromEntries(url.searchParams)
            });
            return widgetQuotationHandler({ req: request, env, ctx });
        }

        // 2.6. Handle Bitrix24 App Main Page (both GET and POST)
        if (url.pathname === '/app' || url.pathname === '/') {
            console.log('📱 APP PAGE REQUEST:', {
                pathname: url.pathname,
                method: request.method,
                queryParams: Object.fromEntries(url.searchParams)
            });
            return indexHandler({ req: request, env, ctx });
        }

        // 2.7. Debug Placements Endpoint
        if (url.pathname === '/debug/placements' && request.method === 'GET') {
            return debugPlacementsHandler({ req: request, env, ctx });
        }

        // 2.8. Widget List Endpoint
        if (url.pathname === '/debug/widget-list' && request.method === 'GET') {
            return widgetListHandler({ req: request, env, ctx });
        }

        // 2.9. Handle App Uninstallation (accepts both GET and POST)
        if (url.pathname === '/uninstall') {
            return uninstallHandler({ req: request, env, ctx });
        }

        // 2.10. Handle favicon requests
        if (url.pathname === '/favicon.ico') {
            return new Response(null, { status: 204 }); // No Content
        }

        // 3. Handle API Routes
        if (url.pathname.startsWith('/api/')) {
            const corsHeaders = {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            };
            return handleAPI(request, url.pathname, corsHeaders, env);
        }

        // 4. For all other requests, serve the frontend application.
        // This handles GET requests for the app's assets and the initial POST from Bitrix24.
        console.log('📍 ROUTING TO indexHandler for:', {
            pathname: url.pathname,
            method: request.method,
            queryParams: Object.fromEntries(url.searchParams)
        });
        return indexHandler({ req: request, env, ctx });
    }
};

// Xử lý API endpoints
async function handleAPI(request, pathname, corsHeaders, env) {
    const headers = {
        ...corsHeaders,
        'Content-Type': 'application/json',
    };

    try {
        // GET /api/message
        if (pathname === '/api/message' && request.method === 'GET') {
            return new Response(JSON.stringify({
                message: 'Hello World từ Cloudflare Worker! 🚀',
                timestamp: new Date().toISOString(),
                appName: env.APP_NAME || 'Bitrix24 App'
            }), { headers });
        }

        // GET /api/random
        if (pathname === '/api/random' && request.method === 'GET') {
            return new Response(JSON.stringify({
                uuid: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                random: Math.random()
            }), { headers });
        }

        // POST /api/process-bitrix-data
        if (pathname === '/api/process-bitrix-data' && request.method === 'POST') {
            const data = await request.json();
            
            // Xử lý data từ Bitrix24
            const processedData = {
                processed: true,
                receivedAt: new Date().toISOString(),
                user: {
                    id: data.user?.ID,
                    fullName: `${data.user?.NAME} ${data.user?.LAST_NAME}`,
                    email: data.user?.EMAIL
                },
                domain: data.domain,
                message: `Xin chào ${data.user?.NAME}! Dữ liệu của bạn đã được xử lý thành công.`,
                // Có thể thêm logic xử lý phức tạp hơn ở đây
                statistics: {
                    userActive: true,
                    processingTime: '0.5ms'
                }
            };

            // Lưu vào KV Storage nếu cần (optional)
            if (env.BITRIX_KV) {
                await env.BITRIX_KV.put(
                    `user_${data.user?.ID}`,
                    JSON.stringify(processedData),
                    { expirationTtl: 3600 } // TTL 1 giờ
                );
            }

            return new Response(JSON.stringify(processedData), { headers });
        }

        // GET /api/webhook - Endpoint cho Bitrix24 webhook (nếu cần)
        if (pathname === '/api/webhook' && request.method === 'POST') {
            const webhookData = await request.json();
            
            console.log('Webhook received:', webhookData);
            
            // Xử lý webhook event từ Bitrix24
            const response = {
                success: true,
                event: webhookData.event,
                processed: new Date().toISOString()
            };

            return new Response(JSON.stringify(response), { headers });
        }

        // GET /api/health - Comprehensive health check endpoint
        if (pathname === '/api/health' && request.method === 'GET') {
            const healthData = await healthCheck(env);
            const statusCode = healthData.status === 'critical' ? 503 : 
                              healthData.status === 'degraded' ? 200 : 200;
            
            return new Response(JSON.stringify(healthData), { 
                status: statusCode,
                headers 
            });
        }

        // GET /api/health/quick - Quick health check endpoint
        if (pathname === '/api/health/quick' && request.method === 'GET') {
            const healthData = await quickHealthCheck(env);
            return new Response(JSON.stringify(healthData), { headers });
        }

        // 404 cho các route không tồn tại
        return new Response(JSON.stringify({
            error: 'API endpoint not found',
            path: pathname
        }), { 
            status: 404,
            headers 
        });

    } catch (error) {
        console.error('API Error:', error);
        return new Response(JSON.stringify({
            error: 'Internal server error',
            message: error.message
        }), { 
            status: 500,
            headers 
        });
    }
}

// Utility function: Verify Bitrix24 request (optional)
function verifyBitrix24Request(request, secret) {
    // Implement signature verification if needed
    const signature = request.headers.get('X-Bitrix-Signature');
    if (!signature) return false;
    
    // Verify signature logic here
    // ...
    
    return true;
}

// Utility function: Call Bitrix24 REST API từ Worker
async function callBitrix24API(domain, method, params, accessToken) {
    const url = `https://${domain}/rest/${method}`;
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            ...params,
            auth: accessToken
        })
    });

    return await response.json();
}
