# Azure Deployment Configuration

## Required Environment Variables

Set these in Azure Portal → Your App Service → Configuration → Application settings:

### ✅ CRITICAL (Required for Production)
```
NODE_ENV=production                                    # REQUIRED - Controls dotenv, CORS, security
MONGO_URI=<your-mongodb-connection-string>            # REQUIRED - Database connection
UPSTASH_REDIS_REST_URL=<your-upstash-redis-url>      # REQUIRED - Cache service
UPSTASH_REDIS_REST_TOKEN=<your-upstash-token>        # REQUIRED - Cache authentication
JWT_SECRET=<strong-random-secret-minimum-32-chars>   # REQUIRED - Session security
CORS_ORIGIN=<comma-separated-urls>                    # REQUIRED in prod - e.g., https://yourapp.com
```

**⚠️ Important Notes:**
- `NODE_ENV=production` **must** be set - it disables dotenv, enforces strict CORS, and requires secrets
- Without `CORS_ORIGIN` in production, **all** cross-origin requests will be **rejected** (security feature)
- `JWT_SECRET` must be strong (32+ characters) - weak secrets are rejected in production
- Redis credentials must be valid or app will fail to start in production

### Optional (Email)
```
SMTP_USER=<your-email@gmail.com>
SMTP_PASS=<your-app-password>
```

### Optional (Configuration)
```
PORT=8080                          # Azure auto-sets this
CORS_ORIGIN=<comma-separated-urls>  # e.g., https://yourapp.com,https://app.com
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW=1 minute
LOG_LEVEL=info
```

## Health Check Setup

1. Go to Azure Portal → Your App Service → Health check
2. Enable health check
3. Set path: `/health`
4. Save changes

## Application Insights (Optional)

To stop the invalid instrumentation key warnings:

**Option 1:** Configure Application Insights
1. Get connection string from Application Insights resource
2. Add to environment variables: `APPLICATIONINSIGHTS_CONNECTION_STRING=<connection-string>`

**Option 2:** Disable Application Insights
1. Go to Azure Portal → Your App Service → Application Insights
2. Turn off Application Insights

## Deployment Checklist

- [ ] All required environment variables set in Azure
- [ ] `NODE_ENV=production` is set
- [ ] JWT_SECRET is strong and unique (not the default)
- [ ] CORS_ORIGIN configured for production domains
- [ ] Health check endpoint enabled at `/health`
- [ ] Application Insights configured or disabled
- [ ] Build and deployment successful via GitHub Actions
- [ ] Server logs show correct port (8080 in Azure)
- [ ] MongoDB and Redis connections successful

## Troubleshooting

### Server listening on wrong port
- Ensure `NODE_ENV=production` is set in Azure
- Check logs for "Starting server with configuration" message
- PORT should be 8080 in Azure logs
- Verify dotenv is not loading .env file in production

### CORS errors in production
- **Root cause**: `CORS_ORIGIN` not set and `NODE_ENV=production`
- **Fix**: Add `CORS_ORIGIN` with your frontend URLs (comma-separated)
- **Example**: `CORS_ORIGIN=https://myapp.com,https://www.myapp.com`
- In dev mode (`NODE_ENV=development`), all origins are allowed

### JWT/Redis failures on startup
- **Symptom**: App crashes immediately after "MongoDB Connected"
- **Cause**: Missing `JWT_SECRET`, `UPSTASH_REDIS_REST_URL`, or `UPSTASH_REDIS_REST_TOKEN`
- **Fix**: Add all required environment variables
- Production mode requires these - no fallback values accepted

### MongoDB connection fails
- Verify `MONGO_URI` is set correctly
- Ensure MongoDB allows connections from Azure IPs
- Check firewall rules in MongoDB Atlas
- Add Azure outbound IPs to MongoDB whitelist

### Redis connection fails  
- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Use REST API endpoints, not Redis protocol URLs
- Example format: `https://your-redis.upstash.io`

### Invalid ObjectId errors
- All ID parameters are now validated automatically
- Returns 400 Bad Request with clear error message
- Check client is sending valid MongoDB ObjectIds

### Application Insights warnings
- Either configure connection string or disable the service
- Warnings don't affect functionality but clutter logs
- To fix: Set `APPLICATIONINSIGHTS_CONNECTION_STRING` or turn off in Azure Portal
