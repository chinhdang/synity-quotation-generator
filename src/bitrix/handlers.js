import { Bitrix24Client } from './client.js';

// Function to get the latest HTML content (equivalent to public/index.html)
async function getLatestHTMLContent() {
  return `<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hello World - Bitrix24 App</title>
    <!-- Thêm Bitrix24 JS SDK -->
    <script src="//api.bitrix24.com/api/v1/"></script>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
        
        h1 {
            color: #2066a9;
            text-align: center;
            margin-bottom: 30px;
            font-size: 2.5em;
        }
        
        .info-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 25px;
        }
        
        .button-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 15px;
            margin: 25px 0;
        }
        
        button {
            background: linear-gradient(45deg, #2066a9, #1976d2);
            color: white;
            border: none;
            padding: 15px 25px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(32, 102, 169, 0.3);
        }
        
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(32, 102, 169, 0.4);
        }
        
        button:active {
            transform: translateY(0);
        }
        
        .output {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            min-height: 100px;
            font-family: 'Courier New', monospace;
            white-space: pre-wrap;
            overflow-x: auto;
        }
        
        .user-info {
            background: #e3f2fd;
            border: 1px solid #bbdefb;
            border-radius: 8px;
            padding: 15px;
            margin: 10px 0;
        }
        
        .success { color: #2e7d32; }
        .error { color: #d32f2f; }
        .info { color: #1976d2; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Hello World - Bitrix24 App</h1>
        
        <div class="info-card">
            <p>Đây là ứng dụng Bitrix24 local được xây dựng với Cloudflare Worker</p>
            <p style="margin-top: 10px; font-size: 14px; color: #666;">
                Status: <span id="status" style="color: #2e7d32;">Đang khởi tạo...</span>
            </p>
        </div>

        <div class="button-group">
            <button id="btnGetUser" type="button">👤 Lấy thông tin người dùng</button>
            <button id="btnGetMessage" type="button">💬 Lấy message từ Worker</button>
            <button id="btnGetUUID" type="button">🎲 Tạo UUID ngẫu nhiên</button>
            <button id="btnGetDepartment" type="button">🏢 Lấy thông tin phòng ban</button>
            <button id="btnGetTasks" type="button">📋 Lấy danh sách task</button>
            <button id="btnCallWorkerAPI" type="button">🔄 Gọi API Worker với Bitrix data</button>
        </div>

        <div id="output" class="output">
            Kết quả sẽ hiển thị ở đây...
        </div>

        <div id="userInfoSection" style="display: none;">
            <h3 style="margin: 20px 0 10px; color: #2066a9;">Thông tin người dùng:</h3>
            <div class="user-info" id="userInfoContent"></div>
        </div>
    </div>

    <script>
        // Debug iframe loading
        console.log('🚀 APP HTML LOADED - Current Time:', new Date().toISOString());
        console.log('🔍 User Agent:', navigator.userAgent);
        console.log('🌐 Location:', window.location.href);
        
        let output = document.getElementById('output');
        let status = document.getElementById('status');
        
        function log(message, type = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const className = type === 'error' ? 'error' : type === 'success' ? 'success' : 'info';
            output.innerHTML += \`<span class="\${className}">[\${timestamp}] \${message}</span>\\n\`;
            output.scrollTop = output.scrollHeight;
        }

        // Khởi tạo Bitrix24 SDK
        BX24.init(function(){
            console.log('✅ Bitrix24 SDK đã sẵn sàng!');
            console.log('📱 BX24 Info:', {
                isAdmin: BX24.isAdmin(),
                domain: BX24.getDomain(),
                lang: BX24.getLang()
            });
            
            status.textContent = 'Đã kết nối Bitrix24 SDK';
            status.style.color = '#2e7d32';
            
            log('✅ Bitrix24 SDK initialized successfully', 'success');
            log(\`📱 Domain: \${BX24.getDomain()}\`, 'info');
            log(\`🌐 Language: \${BX24.getLang()}\`, 'info');
            log(\`👑 Admin: \${BX24.isAdmin() ? 'Yes' : 'No'}\`, 'info');

            // Button 1: Get User Info
            document.getElementById('btnGetUser').addEventListener('click', () => {
                log('🔍 Getting current user info...', 'info');
                BX24.callMethod('user.current', {}, function(result) {
                    if(result.error()) {
                        console.error(result.error());
                        log(\`❌ Error: \${result.error()}\`, 'error');
                    } else {
                        const user = result.data();
                        log(\`✅ User: \${user.NAME} \${user.LAST_NAME} (\${user.EMAIL})\`, 'success');
                        
                        document.getElementById('userInfoContent').innerHTML = \`
                            <p><strong>👤 Name:</strong> \${user.NAME} \${user.LAST_NAME}</p>
                            <p><strong>📧 Email:</strong> \${user.EMAIL}</p>
                            <p><strong>🆔 ID:</strong> \${user.ID}</p>
                            <p><strong>📱 Phone:</strong> \${user.WORK_PHONE || 'Not provided'}</p>
                            <p><strong>🏢 Position:</strong> \${user.WORK_POSITION || 'Not provided'}</p>
                        \`;
                        document.getElementById('userInfoSection').style.display = 'block';
                    }
                });
            });

            // Button 2: Get Message from Worker
            document.getElementById('btnGetMessage').addEventListener('click', async () => {
                log('💬 Getting message from Worker API...', 'info');
                try {
                    const response = await fetch('/api/message');
                    const data = await response.json();
                    log(\`✅ Worker Message: \${data.message}\`, 'success');
                    log(\`⏰ Timestamp: \${data.timestamp}\`, 'info');
                } catch (error) {
                    log(\`❌ Error: \${error.message}\`, 'error');
                }
            });

            // Button 3: Generate UUID
            document.getElementById('btnGetUUID').addEventListener('click', async () => {
                log('🎲 Generating random UUID...', 'info');
                try {
                    const response = await fetch('/api/random');
                    const data = await response.json();
                    log(\`✅ UUID: \${data.uuid}\`, 'success');
                    log(\`⏰ Generated at: \${data.timestamp}\`, 'info');
                } catch (error) {
                    log(\`❌ Error: \${error.message}\`, 'error');
                }
            });

            // Button 4: Get Department Info
            document.getElementById('btnGetDepartment').addEventListener('click', () => {
                log('🏢 Getting department information...', 'info');
                BX24.callMethod('department.get', {}, function(result) {
                    if(result.error()) {
                        log(\`❌ Error: \${result.error()}\`, 'error');
                    } else {
                        const departments = result.data();
                        log(\`✅ Found \${departments.length} departments\`, 'success');
                        departments.forEach(dept => {
                            log(\`🏢 \${dept.NAME} (ID: \${dept.ID})\`, 'info');
                        });
                    }
                });
            });

            // Button 5: Get Tasks
            document.getElementById('btnGetTasks').addEventListener('click', () => {
                log('📋 Getting task list...', 'info');
                BX24.callMethod('tasks.task.list', {
                    filter: { REAL_STATUS: [1, 2, 3] }, // New, Pending, In Progress
                    select: ['ID', 'TITLE', 'STATUS', 'CREATED_DATE'],
                    order: { CREATED_DATE: 'desc' }
                }, function(result) {
                    if(result.error()) {
                        log(\`❌ Error: \${result.error()}\`, 'error');
                    } else {
                        const tasks = result.data().tasks;
                        log(\`✅ Found \${tasks.length} tasks\`, 'success');
                        tasks.slice(0, 5).forEach(task => {
                            log(\`📋 \${task.title} (Status: \${task.status})\`, 'info');
                        });
                    }
                });
            });

            // Button 6: Call Worker API with Bitrix data
            document.getElementById('btnCallWorkerAPI').addEventListener('click', async () => {
                log('🔄 Calling Worker API with Bitrix data...', 'info');
                
                // First get current user
                BX24.callMethod('user.current', {}, async function(result) {
                    if(result.error()) {
                        log(\`❌ Error getting user: \${result.error()}\`, 'error');
                        return;
                    }
                    
                    const user = result.data();
                    
                    try {
                        // Send user data to Worker API
                        const response = await fetch('/api/quote', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                user: {
                                    id: user.ID,
                                    name: \`\${user.NAME} \${user.LAST_NAME}\`,
                                    email: user.EMAIL
                                },
                                domain: BX24.getDomain(),
                                timestamp: new Date().toISOString()
                            })
                        });
                        
                        const data = await response.json();
                        log(\`✅ API Response: \${data.message || 'Success'}\`, 'success');
                        log(\`📊 Processing time: \${data.duration || 'N/A'}ms\`, 'info');
                    } catch (error) {
                        log(\`❌ API Error: \${error.message}\`, 'error');
                    }
                });
            });
        });
    </script>
</body>
</html>`;
}

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
      
      // Load fresh HTML content from public/index.html equivalent
      const htmlContent = await getLatestHTMLContent();

      const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Bitrix-Signature',
        'Content-Security-Policy': "frame-ancestors *; default-src 'self' 'unsafe-inline' 'unsafe-eval' *",
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'ETag': `"${new Date().getTime()}"`
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
