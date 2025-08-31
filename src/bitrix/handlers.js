import { Bitrix24Client } from './client.js';
import { getB24UITemplate } from './b24ui-template.js';
import { getSYNITYCRMTemplate } from './synity-crm-template.js';

// Function to get the latest B24UI HTML content
async function getLatestHTMLContent() {
  return getB24UITemplate();
}

// Helper function to get app URL
function getAppUrl(domain) {
  // Use the correct production URL
  return `https://bx-app-quotation-generator.hicomta.workers.dev`;
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

    console.log('Binding widget placements...');
    try {
      const appUrl = getAppUrl(auth.domain);
      console.log('App URL for placements:', appUrl);
      
      // Clear existing placements first
      try {
        const existingPlacements = await client.call('placement.list');
        console.log('Existing placements:', existingPlacements);
        
        if (existingPlacements.result && existingPlacements.result.length > 0) {
          console.log('Unbinding existing placements...');
          await client.call('placement.unbind');
          console.log('✅ Existing placements unbound');
        }
      } catch (unbindError) {
        console.log('No existing placements to unbind or error:', unbindError.message);
      }
      
      // Use placements that are actually supported (based on log)
      // These are the toolbar placements that were successful before
      const toolbarPlacements = [
        'CRM_LEAD_LIST_TOOLBAR',
        'CRM_DEAL_LIST_TOOLBAR',
        'CRM_CONTACT_LIST_TOOLBAR',
        'CRM_COMPANY_LIST_TOOLBAR',
        'CRM_SMART_INVOICE_LIST_TOOLBAR',
        'CRM_LEAD_DETAIL_TOOLBAR',
        'CRM_DEAL_DETAIL_TOOLBAR',
        'CRM_CONTACT_DETAIL_TOOLBAR',
        'CRM_COMPANY_DETAIL_TOOLBAR',
        'CRM_SMART_INVOICE_DETAIL_TOOLBAR'
      ];
      
      // Additional supported placements
      const activityPlacements = [
        'CRM_LEAD_ACTIVITY_TIMELINE_MENU',
        'CRM_DEAL_ACTIVITY_TIMELINE_MENU',
        'CRM_SMART_INVOICE_ACTIVITY_TIMELINE_MENU'
      ];

      // Bind toolbar placements (these are confirmed working)
      for (const placement of toolbarPlacements) {
        try {
          const result = await client.call('placement.bind', {
            PLACEMENT: placement,
            HANDLER: `${appUrl}/widget/quotation`,
            TITLE: 'Tạo Báo Giá SYNITY',
            DESCRIPTION: 'Tạo báo giá chuyên nghiệp với SYNITY Quotation Generator'
          });
          console.log(`✅ Bound ${placement}:`, result);
        } catch (bindError) {
          console.error(`❌ Failed to bind ${placement}:`, bindError);
        }
      }

      // Bind activity timeline placements  
      for (const placement of activityPlacements) {
        try {
          const result = await client.call('placement.bind', {
            PLACEMENT: placement,
            HANDLER: `${appUrl}/widget/quotation`,
            TITLE: 'SYNITY Báo Giá',
            DESCRIPTION: 'Tạo báo giá từ thông tin CRM này'
          });
          console.log(`✅ Bound ${placement}:`, result);
        } catch (bindError) {
          console.error(`❌ Failed to bind ${placement}:`, bindError);
        }
      }

      console.log('Widget placements binding completed');
    } catch (error) {
      console.error('Failed to bind widget placements:', error);
      // Non-critical error - continue with installation
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

/**
 * Handles widget quotation requests from CRM entities.
 * @param {object} context - An object containing { req, env, ctx }.
 */
export async function widgetQuotationHandler({ req, env, ctx }) {
  try {
    console.log('='.repeat(50));
    console.log('WIDGET QUOTATION REQUEST');
    console.log('='.repeat(50));
    
    const url = new URL(req.url);
    let postData = {};
    
    // Handle both GET and POST methods
    if (req.method === 'GET') {
      // Parse from query parameters
      for (const [key, value] of url.searchParams) {
        postData[key] = value;
      }
      console.log('Widget GET params:', postData);
    } else if (req.method === 'POST') {
      // Parse POST data from Bitrix24 widget
      try {
        const body = await req.text();
        console.log('Widget POST body:', body);
        
        const urlParams = new URLSearchParams(body);
        for (const [key, value] of urlParams) {
          postData[key] = value;
        }
        
        console.log('Parsed widget POST data:', postData);
      } catch (e) {
        console.error('Could not parse widget POST data:', e.message);
      }
    }

    // Extract placement information
    const placement = postData.PLACEMENT || url.searchParams.get('PLACEMENT');
    const domain = postData.DOMAIN || url.searchParams.get('DOMAIN');
    const placementOptions = postData.PLACEMENT_OPTIONS ? 
      JSON.parse(postData.PLACEMENT_OPTIONS) : 
      (url.searchParams.get('PLACEMENT_OPTIONS') ? JSON.parse(url.searchParams.get('PLACEMENT_OPTIONS')) : {});
    
    console.log('Widget placement info:', {
      placement,
      domain,
      placementOptions
    });

    // Get CRM entity ID from placement options
    // Try different possible ID fields
    const entityId = placementOptions.ID || 
                     placementOptions.id || 
                     placementOptions.ENTITY_ID ||
                     placementOptions.entityId ||
                     null;
    
    const entityType = getEntityTypeFromPlacement(placement);
    
    console.log('CRM Entity info:', {
      entityType,
      entityId,
      allPlacementOptions: placementOptions,
      placement: placement
    });
    
    // If no entity ID in LIST_MENU, it might be a bulk action
    if (!entityId && placement.includes('LIST_MENU')) {
      console.log('⚠️ No entity ID provided - this might be a list view action without selection');
    }

    // Create Bitrix24 client to fetch CRM data
    let client;
    try {
      client = await Bitrix24Client.createFromStoredSettings(env);
      console.log('Bitrix24Client created for widget');
    } catch (error) {
      console.error('Failed to create Bitrix24Client for widget:', error);
      return new Response('Failed to initialize Bitrix24 client', { status: 500 });
    }

    // Fetch CRM entity data
    let crmData = {
      responsiblePersonName: '',
      responsiblePersonPhone: '',
      responsiblePersonEmail: '',
      clientCompanyName: '',
      client_address: '',
      client_tax_code: '',
      contact_name: '',
      contact_phone: '',
      contact_email: '',
      bitrixProducts: []
    };
    
    if (entityId && client) {
      try {
        crmData = await fetchCRMEntityData(client, entityType, entityId);
        console.log('✅ Fetched CRM data:', crmData);
      } catch (error) {
        console.error('⚠️ Failed to fetch CRM data:', error);
        console.log('Using default/empty data - user can fill manually');
      }
    } else {
      console.log('ℹ️ No entity ID or client available - using empty form');
    }

    // Generate SYNITY quotation interface with pre-filled CRM data
    const synityCRMHtml = await generateSYNITYCRMInterface(crmData);

    console.log('Returning SYNITY CRM interface');
    
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Bitrix-Signature',
      'Content-Security-Policy': "frame-ancestors *; default-src 'self' 'unsafe-inline' 'unsafe-eval' *",
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    };

    return new Response(synityCRMHtml, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        ...corsHeaders
      }
    });

  } catch (error) {
    console.error('Widget quotation handler failed:', error);
    return new Response('Widget quotation process failed.', { status: 500 });
  }
}

// Helper function to determine entity type from placement
function getEntityTypeFromPlacement(placement) {
  if (placement.includes('LEAD')) return 'lead';
  if (placement.includes('DEAL')) return 'deal';
  if (placement.includes('INVOICE')) return 'invoice';
  if (placement.includes('CONTACT')) return 'contact';
  if (placement.includes('COMPANY')) return 'company';
  if (placement.includes('SMART_INVOICE')) return 'smart_invoice';
  return 'unknown';
}

// Function to fetch CRM entity data
async function fetchCRMEntityData(client, entityType, entityId) {
  const data = {
    responsiblePersonName: '',
    responsiblePersonPhone: '',
    responsiblePersonEmail: '',
    clientCompanyName: '',
    client_address: '',
    client_tax_code: '',
    contact_name: '',
    contact_phone: '',
    contact_email: '',
    bitrixProducts: []
  };

  try {
    // First, get current user as responsible person (fallback)
    try {
      const currentUser = await client.call('user.current');
      if (currentUser.result) {
        const userData = currentUser.result;
        data.responsiblePersonName = `${userData.NAME || ''} ${userData.LAST_NAME || ''}`.trim();
        data.responsiblePersonPhone = userData.WORK_PHONE || userData.PERSONAL_MOBILE || '';
        data.responsiblePersonEmail = userData.EMAIL || '';
        console.log('Got current user as responsible:', data.responsiblePersonName);
      }
    } catch (userError) {
      console.error('Failed to get current user:', userError);
    }

    // If no entity ID, return with current user data only
    if (!entityId) {
      console.log('No entity ID - returning with current user data only');
      return data;
    }

    let entity = null;
    
    // Fetch entity based on type
    switch (entityType) {
      case 'lead':
        entity = await client.call('crm.lead.get', { id: entityId });
        break;
      case 'deal':
        entity = await client.call('crm.deal.get', { id: entityId });
        break;
      case 'invoice':
        entity = await client.call('crm.item.get', { 
          entityTypeId: 31, // Smart Invoice entity type
          id: entityId 
        });
        break;
    }

    if (entity && entity.result) {
      const entityData = entity.result;
      
      // Get responsible person
      if (entityData.ASSIGNED_BY_ID) {
        const user = await client.call('user.get', { ID: entityData.ASSIGNED_BY_ID });
        if (user.result && user.result.length > 0) {
          const userData = user.result[0];
          data.responsiblePersonName = `${userData.NAME} ${userData.LAST_NAME}`.trim();
          data.responsiblePersonPhone = userData.WORK_PHONE || userData.PERSONAL_MOBILE || '';
          data.responsiblePersonEmail = userData.EMAIL || '';
        }
      }

      // Get company information
      let companyId = entityData.COMPANY_ID;
      if (companyId) {
        const company = await client.call('crm.company.get', { id: companyId });
        if (company.result) {
          const companyData = company.result;
          data.clientCompanyName = companyData.TITLE || '';
          data.client_address = companyData.ADDRESS || '';
          data.client_tax_code = companyData.UF_CRM_TAX_ID || '';
        }
      }

      // Get contact information
      let contactId = entityData.CONTACT_ID;
      if (contactId) {
        const contact = await client.call('crm.contact.get', { id: contactId });
        if (contact.result) {
          const contactData = contact.result;
          data.contact_name = `${contactData.NAME} ${contactData.LAST_NAME}`.trim();
          data.contact_phone = contactData.PHONE?.[0]?.VALUE || '';
          data.contact_email = contactData.EMAIL?.[0]?.VALUE || '';
        }
      }

      // Get product rows
      if (entityType === 'deal') {
        const products = await client.call('crm.deal.productrows.get', { id: entityId });
        if (products.result) {
          data.bitrixProducts = products.result;
        }
      }
    }

  } catch (error) {
    console.error('Error fetching CRM data:', error);
  }

  return data;
}

// Function to generate SYNITY CRM interface
async function generateSYNITYCRMInterface(crmData) {
  return getSYNITYCRMTemplate(crmData);
}

/**
 * Debug handler to check current placements
 * @param {object} context - An object containing { req, env, ctx }.
 */
export async function debugPlacementsHandler({ req, env, ctx }) {
  try {
    console.log('='.repeat(30));
    console.log('DEBUG PLACEMENTS REQUEST');
    console.log('='.repeat(30));

    const url = new URL(req.url);
    const authId = url.searchParams.get('AUTH_ID');
    const domain = url.searchParams.get('DOMAIN');

    // Try to create client with auth if provided
    let client = null;
    let placements = [];
    let authStatus = 'No authentication';
    
    if (authId && domain) {
      // Use provided auth
      try {
        const auth = {
          access_token: authId,
          domain: domain,
          client_endpoint: `https://${domain}/rest/`
        };
        client = new Bitrix24Client(auth, env);
        authStatus = `✅ Authenticated with domain: ${domain}`;
        console.log('Using provided auth from URL params');
      } catch (error) {
        console.error('Failed to create client with URL auth:', error);
        authStatus = `⚠️ Failed to use URL auth: ${error.message}`;
      }
    } else {
      // Try stored settings
      try {
        client = await Bitrix24Client.createFromStoredSettings(env);
        authStatus = '✅ Using stored authentication';
        console.log('Using stored auth settings');
      } catch (error) {
        console.error('No valid auth available:', error);
        authStatus = `❌ No authentication available. ${error.message}`;
      }
    }

    // Get current placements if client is available
    if (client) {
      try {
        const result = await client.call('placement.list');
        placements = result.result || [];
        console.log('Current placements:', placements);
      } catch (error) {
        console.error('Failed to get placements:', error);
        authStatus += ` | ❌ Failed to get placements: ${error.message}`;
      }
    }

    // Generate debug HTML
    const debugHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SYNITY App - Debug Placements</title>
        <script src="//api.bitrix24.com/api/v1/"></script>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .placement { background: #f5f5f5; padding: 10px; margin: 10px 0; border-left: 4px solid #0D9488; }
          .status-good { color: #10B981; font-weight: bold; }
          .status-error { color: #EF4444; font-weight: bold; }
          .status-warn { color: #F59E0B; font-weight: bold; }
          .json { background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 6px; font-family: monospace; white-space: pre-wrap; }
          .auth-help { background: #FEF3C7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #F59E0B; }
          button { background: #0D9488; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; margin: 5px; }
          button:hover { background: #0d8478; }
        </style>
      </head>
      <body>
        <h1>🔧 SYNITY App - Placement Debug</h1>
        
        <h2>Authentication Status</h2>
        <p>${authStatus}</p>
        <p>App URL: <strong>${getAppUrl('debug')}</strong></p>
        <p>Total Placements Found: <strong>${placements.length}</strong></p>
        
        <h2>Current Placements</h2>
        ${placements.length === 0 ? 
          '<p class="status-error">❌ No placements found! Please reinstall the app.</p>' :
          placements.map(p => `
            <div class="placement">
              <h3>${p.PLACEMENT}</h3>
              <p><strong>Title:</strong> ${p.TITLE}</p>
              <p><strong>Handler:</strong> ${p.HANDLER}</p>
              <p><strong>Description:</strong> ${p.DESCRIPTION || 'N/A'}</p>
            </div>
          `).join('')
        }
        
        <h2>Expected CRM Placements</h2>
        <ul>
          <li>CRM_LEAD_LIST_MENU</li>
          <li>CRM_DEAL_LIST_MENU</li>
          <li>CRM_CONTACT_LIST_MENU</li>
          <li>CRM_COMPANY_LIST_MENU</li>
          <li>CRM_SMART_INVOICE_LIST_MENU</li>
          <li>CRM_LEAD_DETAIL_TAB</li>
          <li>CRM_DEAL_DETAIL_TAB</li>
          <li>CRM_CONTACT_DETAIL_TAB</li>
          <li>CRM_COMPANY_DETAIL_TAB</li>
          <li>CRM_SMART_INVOICE_DETAIL_TAB</li>
        </ul>
        
        <h2>Raw API Response</h2>
        <div class="json">${JSON.stringify(placements, null, 2)}</div>
        
        <h2>Troubleshooting</h2>
        ${!client ? `
        <div class="auth-help">
          <h3>⚠️ No Authentication Available</h3>
          <p>To check placements, open this debug page from within Bitrix24:</p>
          <ol>
            <li>Open your Bitrix24 app</li>
            <li>Click the "Check Placements" button from the main interface</li>
            <li>Or manually add AUTH_ID and DOMAIN parameters to the URL</li>
          </ol>
          <button onclick="tryBX24Init()">Try to Initialize BX24</button>
        </div>
        ` : ''}
        
        <p>If no placements are shown:</p>
        <ol>
          <li>Reinstall the app completely</li>
          <li>Check installation logs</li>
          <li>Verify app permissions in Bitrix24</li>
          <li>Clear browser cache and reload CRM pages</li>
        </ol>
        
        <h2>Manual Placement Binding</h2>
        <p>If automatic binding failed, you can try these steps:</p>
        <button onclick="window.location.href='/install'">Go to Install Page</button>
        <button onclick="testPlacement()">Test Placement Call</button>
        
        <script>
          function tryBX24Init() {
            if (typeof BX24 !== 'undefined') {
              BX24.init(function(){
                BX24.getAuth(function(auth){
                  const url = new URL(window.location.href);
                  url.searchParams.set('AUTH_ID', auth.access_token);
                  url.searchParams.set('DOMAIN', auth.domain);
                  window.location.href = url.toString();
                });
              });
            } else {
              alert('BX24 SDK not available. Open this page from within Bitrix24.');
            }
          }
          
          function testPlacement() {
            if (typeof BX24 !== 'undefined') {
              BX24.init(function(){
                BX24.callMethod('placement.list', {}, function(result){
                  console.log('Placement test result:', result);
                  alert('Check console for placement result');
                });
              });
            } else {
              alert('BX24 SDK not available');
            }
          }
        </script>
      </body>
      </html>
    `;

    return new Response(debugHtml, {
      headers: { 
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-cache'
      }
    });

  } catch (error) {
    console.error('Debug placements handler failed:', error);
    return new Response(`Debug failed: ${error.message}`, { status: 500 });
  }
}
