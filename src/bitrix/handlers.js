import { Bitrix24Client } from './client.js';

/**
 * Handles the application installation request from Bitrix24.
 * @param {object} context - An object containing { req, env, ctx }.
 */
export async function installHandler({ req, env, ctx }) {
  try {
    const url = new URL(req.url);
    const params = url.searchParams;

    // Read auth data from URL query string, not from the body.
    const auth = {
      access_token: params.get('AUTH_ID'),
      expires_in: params.get('AUTH_EXPIRES'),
      application_token: params.get('APP_SID'),
      refresh_token: params.get('REFRESH_ID'),
      domain: params.get('DOMAIN'),
      client_endpoint: `https://${params.get('DOMAIN')}/rest/`,
    };

    // Basic validation
    if (!auth.access_token || !auth.domain) {
      return new Response('Invalid installation data from Bitrix24', { status: 400 });
    }

    const client = await Bitrix24Client.createFromStoredSettings();
    await client.saveSettings(auth);

    // Respond with the script to finish the installation in the Bitrix24 UI.
    const installFinishHTML = `
      <head>
        <script src="//api.bitrix24.com/api/v1/"></script>
        <script>
          BX24.init(function(){
            BX24.installFinish();
          });
        </script>
      </head>
      <body>
        Installation finished successfully.
      </body>
    `;
    return new Response(installFinishHTML, { headers: { 'Content-Type': 'text/html' } });
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
    // env.ASSETS is the binding to the static asset directory defined in wrangler.toml
    const response = await env.ASSETS.fetch(assetRequest);

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
    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
    });
  } catch (error) {
    console.error('Error serving static asset:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
