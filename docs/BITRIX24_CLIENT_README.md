# 🚀 Bitrix24 Cloudflare Worker Client

A production-ready Bitrix24 REST API client designed specifically for Cloudflare Workers, with full PHP CRest.php compatibility, automatic retry logic, and advanced features.

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Testing](#testing)
- [Migration from PHP](#migration-from-php)

## ✨ Features

### 🔄 **CRest.php Compatibility**
- ✅ Automatic token refresh
- ✅ Batch processing (50 requests/batch)
- ✅ Rate limiting (2 requests/second)
- ✅ Complete error handling
- ✅ Same method signatures

### ⚡ **Cloudflare Workers Optimized**
- ✅ KV Storage for persistence
- ✅ Edge-optimized architecture
- ✅ CORS handling for Bitrix24
- ✅ Health monitoring
- ✅ Analytics tracking

### 🛡️ **Production Ready**
- ✅ Comprehensive error handling
- ✅ Automatic retries with backoff
- ✅ Request/response logging
- ✅ Performance analytics
- ✅ Full test coverage

## 🚀 Quick Start

### 1. Installation Flow

When Bitrix24 installs your app, it will POST to `/install`:

```javascript
// src/index.js handles this automatically
if (url.pathname === '/install' && request.method === 'POST') {
    return installHandler({ req: request, env, ctx });
}
```

### 2. Basic Usage

```javascript
import { Bitrix24Client } from './bitrix/client.js';

export default {
    async fetch(request, env, ctx) {
        // Create client from stored settings
        const client = await Bitrix24Client.createFromStoredSettings(env);
        
        // Make API calls
        const user = await client.call('user.current');
        console.log('Current user:', user.result);
        
        return new Response(JSON.stringify(user));
    }
};
```

## ⚙️ Configuration

### Wrangler Configuration

```toml
# wrangler.toml
[[kv_namespaces]]
binding = "BITRIX_KV"
id = "your-kv-namespace-id"

[vars]
APP_NAME = "Your Bitrix24 App"

# Optional secrets (for OAuth apps)
# BITRIX_CLIENT_ID = "local.your-client-id"
# BITRIX_CLIENT_SECRET = "your-client-secret"
```

### Environment Variables

```bash
# Optional - only needed for OAuth refresh
wrangler secret put BITRIX_CLIENT_ID
wrangler secret put BITRIX_CLIENT_SECRET
```

## 📖 Usage Examples

### Basic API Calls

```javascript
// Simple call
const user = await client.call('user.current');

// Call with parameters
const deals = await client.call('crm.deal.list', {
    filter: { 'STAGE_ID': 'NEW' },
    select: ['ID', 'TITLE', 'OPPORTUNITY'],
    order: { 'DATE_CREATE': 'DESC' }
});
```

### Batch Processing

```javascript
const methods = [
    { key: 'user', method: 'user.current' },
    { key: 'deals', method: 'crm.deal.list', params: { select: ['ID', 'TITLE'] } },
    { key: 'contacts', method: 'crm.contact.list', params: { select: ['ID', 'NAME'] } }
];

const results = await client.callBatch(methods, true); // halt on error
console.log('Batch results:', results[0].result.result);
```

### Error Handling

```javascript
try {
    const result = await client.call('some.method');
} catch (error) {
    if (error.isRetryable()) {
        console.log('Will be retried automatically');
    } else {
        console.log('Permanent error:', error.getRecommendedAction());
    }
}
```

### Storage Operations

```javascript
import { BX24Storage } from './bitrix/storage.js';

const storage = new BX24Storage(env.BITRIX_KV);

// Save auth data for specific user
await storage.saveAuth('domain.bitrix24.com', 'user123', authData);

// Get analytics
const stats = await storage.getAnalytics('2024-01-01');
console.log('API usage:', stats);
```

## 📚 API Reference

### Bitrix24Client

#### Static Methods

- `createFromStoredSettings(env)` - Create client from KV storage
- `BATCH_COUNT` - Maximum batch size (50)
- `MAX_RETRIES` - Maximum retry attempts (3)

#### Instance Methods

- `call(method, params, attemptCount)` - Make API call with retry logic
- `callBatch(methods, halt)` - Execute multiple calls in batches
- `refreshToken()` - Refresh expired access token
- `saveSettings(newSettings)` - Save settings to KV storage

### BX24Storage

- `saveAuth(domain, userId, authData)` - Save authentication data
- `getAuth(domain, userId)` - Retrieve authentication data  
- `saveAnalytics(method, duration, success, errorCode)` - Track API usage
- `getAnalytics(date)` - Get usage statistics
- `saveErrorLog(errorData)` - Log errors for debugging

### Error Classes

- `BX24Error` - Enhanced error with retry logic
- `isRetryable()` - Check if error can be retried
- `getRetryDelay()` - Get recommended delay
- `getRecommendedAction()` - Get suggested action

## ⚠️ Error Handling

### Automatic Error Recovery

The client handles these errors automatically:

| Error Code | Action | Retry | Delay |
|------------|--------|-------|-------|
| `expired_token` | Refresh token | ✅ | 0ms |
| `QUERY_LIMIT_EXCEEDED` | Wait | ✅ | 500ms |
| `INTERNAL_SERVER_ERROR` | Wait | ✅ | 1000ms |
| `invalid_token` | Reinstall app | ❌ | - |
| `ERROR_METHOD_NOT_FOUND` | Check permissions | ❌ | - |

### Custom Error Handling

```javascript
import { BX24_ERRORS } from './bitrix/errors.js';

try {
    await client.call('user.admin');
} catch (error) {
    switch (error.code) {
        case 'ERROR_METHOD_NOT_FOUND':
            console.log('App needs admin permissions');
            break;
        case 'invalid_token':
            console.log('App needs reinstallation');
            break;
        default:
            console.log('Error details:', error.toJSON());
    }
}
```

## 🧪 Testing

### Run Tests

```bash
npm test                 # Run all tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:coverage    # With coverage report
```

### Health Checks

```bash
# Check worker health
curl https://your-worker.dev/api/health

# Quick health check
curl https://your-worker.dev/api/health/quick
```

## 🔄 Migration from PHP

### CRest.php → Bitrix24Client

| PHP CRest | JavaScript Client | Notes |
|-----------|------------------|--------|
| `CRest::call()` | `client.call()` | Same parameters |
| `CRest::callBatch()` | `client.callBatch()` | Same format |
| `CRest::installApp()` | `installHandler()` | Handled in routing |
| `$_REQUEST` parameters | URL searchParams | Auto-extracted |

### Settings Storage

| PHP | Cloudflare Workers |
|-----|-------------------|
| `settings.json` file | KV Storage |
| File permissions | KV namespace binding |
| `getSettingData()` | `storage.getAppSettings()` |

### Error Handling

```php
// PHP CRest
if($result['error'] == 'expired_token') {
    $result = static::GetNewAuth($arParams);
}
```

```javascript
// JavaScript Client (automatic)
try {
    const result = await client.call('method');
} catch (error) {
    // Token refresh happens automatically
    // No manual intervention needed
}
```

## 🔍 Monitoring & Analytics

### Built-in Analytics

```javascript
// View today's usage
const stats = await storage.getAnalytics();
console.log(`API calls: ${stats.total_calls}`);
console.log(`Success rate: ${stats.successful_calls / stats.total_calls * 100}%`);
console.log(`Average response time: ${stats.avg_duration}ms`);
```

### Error Logs

```javascript
// Errors are automatically logged
const errorLogs = await env.BITRIX_KV.list({ prefix: 'error_log_' });
```

### Health Monitoring

- `/api/health` - Comprehensive health check
- `/api/health/quick` - Fast health status  
- KV storage connectivity
- Rate limiter status
- Bitrix24 connectivity

## 🚀 Deployment

### Deploy to Cloudflare

```bash
# Create KV namespace
wrangler kv namespace create "BITRIX_KV"

# Update wrangler.toml with namespace ID
# Deploy
npm run deploy
```

### Production Checklist

- ✅ KV namespace created and configured
- ✅ Environment variables set (if using OAuth)
- ✅ Health checks responding
- ✅ Error logging working
- ✅ Rate limiting active
- ✅ CORS headers configured

## 🆘 Troubleshooting

### Common Issues

1. **405 Method Not Allowed**
   - Check CORS configuration
   - Verify POST/GET handling in router

2. **Token Refresh Fails**
   - Verify CLIENT_ID and CLIENT_SECRET
   - Check refresh_token validity

3. **KV Storage Errors**
   - Confirm namespace binding in wrangler.toml
   - Check KV permissions

4. **Rate Limiting Issues**
   - Monitor `/api/health` for current limits
   - Check globalRateLimiter status

### Debug Mode

```javascript
// Enable detailed logging
const client = new Bitrix24Client(settings, env);
console.log('Client settings:', client.settings);
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new features
4. Run full test suite
5. Submit pull request

## 📄 License

MIT License - see LICENSE file for details.

---

**🎯 This client provides 100% feature parity with CRest.php while being optimized for Cloudflare Workers' edge computing environment.**