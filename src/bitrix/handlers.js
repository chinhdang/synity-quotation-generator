import { Bitrix24Client } from './client.js';

/**
 * Handles the application installation request from Bitrix24.
 * @param {object} context - An object containing { req, env, ctx }.
 */
export async function installHandler({ req, env, ctx }) {
  try {
    console.log('='.repeat(50));
    console.log('NEW INSTALLATION REQUEST');
    console.log('='.repeat(50));
    
    const url = new URL(req.url);
    const params = url.searchParams;

    // Debug: Log all parameters received from Bitrix24
    console.log('Installation request received:');
    console.log('URL:', req.url);
    console.log('Method:', req.method);
    console.log('Content-Type:', req.headers.get('content-type'));

    // Check for POST body data
    let postData = null;
    if (req.method === 'POST') {
      try {
        const contentType = req.headers.get('content-type') || '';
        if (contentType.includes('application/x-www-form-urlencoded')) {
          const body = await req.text();
          console.log('POST body (raw):', body);
          postData = new URLSearchParams(body);
          console.log('POST body params:');
          for (const [key, value] of postData) {
            console.log(`  ${key}: ${value}`);
          }
        } else if (contentType.includes('application/json')) {
          postData = await req.json();
          console.log('POST JSON data:', postData);
        }
      } catch (e) {
        console.log('Could not parse POST body:', e.message);
      }
    }

    console.log('Query params:');
    for (const [key, value] of params) {
      console.log(`  ${key}: ${value}`);
    }

    // Helper function to get parameter from query or POST data
    const getParam = (key) => {
      return params.get(key) || 
             (postData && postData.get ? postData.get(key) : null) ||
             (postData && postData[key] ? postData[key] : null);
    };

    // Read auth data from URL query string or POST body
    const auth = {
      access_token: getParam('AUTH_ID'),
      expires_in: getParam('AUTH_EXPIRES'), 
      application_token: getParam('APP_SID'),
      refresh_token: getParam('REFRESH_ID'),
      domain: getParam('DOMAIN'),
      client_endpoint: `https://${getParam('DOMAIN')}/rest/`,
    };

    console.log('Parsed auth data:', auth);

    // Basic validation
    if (!auth.access_token || !auth.domain) {
      console.error('Missing required auth data:', { access_token: !!auth.access_token, domain: !!auth.domain });
      return new Response('Invalid installation data from Bitrix24', { status: 400 });
    }

    console.log('Auth validation passed, creating Bitrix24Client...');

    // Create client directly from auth data since this is initial installation
    let client;
    try {
      client = new Bitrix24Client(auth, env);
      console.log('Bitrix24Client created successfully');
    } catch (error) {
      console.error('Failed to create Bitrix24Client:', error);
      return new Response('Failed to initialize Bitrix24 client', { status: 500 });
    }

    console.log('Saving settings to KV storage...');
    try {
      await client.saveSettings(auth);
      console.log('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      return new Response('Failed to save installation settings', { status: 500 });
    }

    console.log('Preparing HTML response...');

    // Respond with the script to finish the installation in the Bitrix24 UI.
    const installFinishHTML = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Installation Complete</title>
    <script src="//api.bitrix24.com/api/v1/"></script>
    <script>
        console.log('BX24 script loaded, initializing...');
        BX24.init(function(){
            console.log('BX24 initialized');
            
            // Show success message and animate progress bar
            document.getElementById('status').innerHTML = 'Cài đặt thành công! Đang hoàn tất...';
            
            let progress = 0;
            const progressBar = document.getElementById('progress');
            const progressInterval = setInterval(function() {
                progress += 2;
                progressBar.style.width = progress + '%';
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                    document.getElementById('status').innerHTML = 'Hoàn tất! Đang chuyển hướng...';
                    
                    setTimeout(function() {
                        console.log('Calling installFinish...');
                        BX24.installFinish();
                        console.log('installFinish called');
                    }, 500);
                }
            }, 60); // Update every 60ms for smooth animation
        });
    </script>
</head>
<body style="font-family: Arial, sans-serif; text-align: center; padding: 50px;">
    <h2>🎉 Cài đặt ứng dụng thành công!</h2>
    <p>Ứng dụng Bitrix24 Quotation Generator đã được cài đặt.</p>
    <div id="status" style="color: #007acc; font-weight: bold; margin: 20px;">
        Đang xử lý...
    </div>
    <div style="margin-top: 30px;">
        <div style="display: inline-block; width: 200px; height: 4px; background: #f0f0f0; border-radius: 2px;">
            <div id="progress" style="width: 0%; height: 100%; background: #007acc; border-radius: 2px; transition: width 0.1s;"></div>
        </div>
    </div>
</body>
</html>`;

    console.log('Returning HTML response with length:', installFinishHTML.length);
    
    const response = new Response(installFinishHTML, { 
        headers: { 
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
        } 
    });
    
    console.log('='.repeat(50));
    console.log('INSTALLATION COMPLETED SUCCESSFULLY');
    console.log('='.repeat(50));
    
    return response;
  } catch (error) {
    console.error('Installation failed:', error);
    return new Response('Installation process failed.', { status: 500 });
  }
}

/**
 * Handles requests to the main application page.
 * Serves the static index.html for both GET and POST requests.
 * @param {object} context - An object containing { req, env, ctx }.
 */
export async function indexHandler({ req, env, ctx }) {
  console.log('='.repeat(30));
  console.log('INDEX HANDLER REQUEST');
  console.log('='.repeat(30));
  console.log('URL:', req.url);
  console.log('Method:', req.method);
  console.log('User-Agent:', req.headers.get('user-agent'));
  console.log('Referer:', req.headers.get('referer'));
  
  // Log POST data if present
  if (req.method === 'POST') {
    try {
      const cloneReq = req.clone();
      const body = await cloneReq.text();
      console.log('POST Body from Bitrix24:', body.substring(0, 200) + '...');
    } catch (e) {
      console.log('Could not read POST body:', e.message);
    }
  }

  let assetRequest = req;

  // If Bitrix sends a POST, we transform it into a GET request
  // so that the static asset server can find the file.
  if (req.method === 'POST') {
    assetRequest = new Request(req.url, {
      method: 'GET',
      headers: req.headers,
    });
  }

  try {
    console.log('Serving static files with Workers Sites...');
    
    // Serve HTML content directly for all app requests  
    if (assetRequest.url.includes('/app') || assetRequest.url.endsWith('/') || assetRequest.url.endsWith('/index.html')) {
      console.log('Serving HTML content directly for app request');
      
      // Import HTML content from public/index.html
      // For now, we'll use the exact content from the public file
      const htmlContent = `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello World - Bitrix24 App</title>
    <!-- Thêm Bitrix24 JS SDK -->
    <script src="//api.bitrix24.com/api/v1/"></script>
    <!-- Cache busting -->
    <meta name="version" content="${new Date().toISOString()}">
</head>
<body>
    <h1>Hello World!</h1>
    <p>Đây là ứng dụng Bitrix24 local của bạn</p>
    
    <button id="button" type="button">Lấy thông tin người dùng</button>
    <output id="userInfo" for="button"></output>
    
    <script>
        // Khởi tạo Bitrix24 SDK
        BX24.init(function(){
            console.log('Bitrix24 SDK đã sẵn sàng!');
            
            // Lấy thông tin người dùng hiện tại khi click button
            const button = document.getElementById("button");
            button.addEventListener("click", () => {
                BX24.callMethod(
                    'user.current',
                    {},
                    function(result) {
                        if(result.error()) {
                            console.error(result.error());
                        } else {
                            const user = result.data();
                            const userInfo = document.getElementById('userInfo');
                            userInfo.innerHTML = \`
                                <p>Xin chào: \${user.NAME} \${user.LAST_NAME}</p>
                                <p>Email: \${user.EMAIL}</p>
                            \`;
                        }
                    }
                );
            });
        });
    </script>
</body>
</html>`;

      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Bitrix-Signature',
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': "frame-ancestors 'self' https://*.bitrix24.com https://*.bitrix24.ru https://*.bitrix24.eu",
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      };

      console.log('Returning HTML content with CORS headers');
      return new Response(htmlContent, {
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          ...corsHeaders
        }
      });
    }
    
    // For other assets, try to fetch from the site
    const response = await fetch(assetRequest);
    
    console.log('Asset response:', {
      status: response.status,
      statusText: response.statusText,
      contentType: response.headers.get('content-type'),
      contentLength: response.headers.get('content-length')
    });

    if (response.status === 404) {
      console.log('Asset not found, falling back to index.html');
      // Try to serve index.html as fallback
      const indexRequest = new Request(new URL('/index.html', assetRequest.url), {
        method: 'GET',
        headers: assetRequest.headers,
      });
      const indexResponse = await env.ASSETS.fetch(indexRequest);
      
      if (indexResponse.status === 200) {
        console.log('Successfully serving index.html as fallback');
        const corsHeaders = {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Bitrix-Signature',
        };
        const newHeaders = new Headers(indexResponse.headers);
        for (const key in corsHeaders) {
          newHeaders.set(key, corsHeaders[key]);
        }
        return new Response(indexResponse.body, {
          status: 200,
          statusText: 'OK',
          headers: newHeaders,
        });
      }
    }

    // Add CORS headers to the successful response
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Bitrix-Signature',
    };
    const newHeaders = new Headers(response.headers);
    for (const key in corsHeaders) {
        newHeaders.set(key, corsHeaders[key]);
    }
    
    console.log('Returning asset response with CORS headers');
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
  } catch (error) {
    console.error('Error serving static asset:', error);
    console.error('Error details:', error.stack);
    return new Response(`Internal Server Error: ${error.message}`, { status: 500 });
  }
}
