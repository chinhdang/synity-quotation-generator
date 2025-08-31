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

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        
        // CORS headers cho Bitrix24
        const corsHeaders = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400',
        };

        // Handle OPTIONS request (CORS preflight)
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: corsHeaders });
        }

        // API Routes
        if (url.pathname.startsWith('/api/')) {
            return handleAPI(request, url.pathname, corsHeaders, env);
        }

        // Serve static files (HTML, CSS, JS)
        return env.ASSETS.fetch(request);
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

        // GET /api/health - Health check endpoint
        if (pathname === '/api/health' && request.method === 'GET') {
            return new Response(JSON.stringify({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                version: '1.0.0'
            }), { headers });
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
