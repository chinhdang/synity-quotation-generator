# Development Testing Guide

## 🎯 Problem
Bitrix24 widget placements are bound to a specific URL during app installation. Once installed with production URL, the widgets will always call production, even when you want to test dev environment.

## 🚀 Solutions

### 1. Direct URL Testing (Quickest)
Instead of clicking the widget in Bitrix24, open the dev URL directly in browser:

```
https://bx-app-quotation-generator-dev.hicomta.workers.dev/widget/quotation?DOMAIN=tamgiac.bitrix24.com&PROTOCOL=1&LANG=en&APP_SID=test
```

You can bookmark this URL for quick access.

### 2. Browser DevTools Override (Advanced)
Use Chrome DevTools to redirect requests:

1. Open DevTools (F12)
2. Go to Network tab
3. Right-click on request to `bx-app-quotation-generator.hicomta.workers.dev`
4. Select "Override content" 
5. Redirect to dev URL

### 3. Create Separate Dev App in Bitrix24
Create a second app in Bitrix24 specifically for development:

1. Go to Bitrix24 > Applications > Developer resources
2. Add new local application
3. Use dev URL: `https://bx-app-quotation-generator-dev.hicomta.workers.dev`
4. Install this app for testing

### 4. Use Local Tunnel (ngrok)
For local development:

```bash
# Install ngrok
npm install -g ngrok

# Run local server
wrangler dev

# Expose local server
ngrok http 8787
```

Then use ngrok URL in Bitrix24.

## 📋 Environment URLs

| Environment | URL | Purpose |
|------------|-----|---------|
| Production | https://bx-app-quotation-generator.hicomta.workers.dev | Live app |
| Development | https://bx-app-quotation-generator-dev.hicomta.workers.dev | Testing |
| Local | http://localhost:8787 | Local development |

## 🔍 How to Check Which Environment You're On

1. **Check URL** - Look at browser address bar
2. **Check Console** - Dev environment will show dev info logs
3. **Check UI** - Dev environment shows dev info panel (if implemented)

## 🚨 Important Notes

- Widget placements are **permanent** once installed
- To change widget URL, you must **uninstall and reinstall** the app
- Or create **separate apps** for dev/staging/production
- Use **environment variables** to manage different configs

## 🛠 Quick Test Links

Replace `{DEAL_ID}` with actual deal ID:

### Production
```
https://bx-app-quotation-generator.hicomta.workers.dev/widget/quotation?DOMAIN=tamgiac.bitrix24.com&PLACEMENT=CRM_DEAL_DETAIL_TAB&PLACEMENT_OPTIONS={"ID":"{DEAL_ID}"}
```

### Development  
```
https://bx-app-quotation-generator-dev.hicomta.workers.dev/widget/quotation?DOMAIN=tamgiac.bitrix24.com&PLACEMENT=CRM_DEAL_DETAIL_TAB&PLACEMENT_OPTIONS={"ID":"{DEAL_ID}"}
```

## 🔄 Switching Between Environments

```bash
# Deploy to production
git checkout main
wrangler deploy

# Deploy to development
git checkout dev
wrangler deploy --env dev

# Check current deployment
wrangler deployments list
```