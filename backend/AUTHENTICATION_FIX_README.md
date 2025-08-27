# Authentication Issues Fix Guide

## Problem Summary

The backend authentication system has several issues that need to be fixed:

1. **JWT Token Expiration Too Short**: Tokens are expiring in 8-15 minutes instead of a reasonable duration
2. **Frontend Token Storage**: The frontend is not properly storing or sending JWT tokens
3. **CORS Configuration**: CORS needs to be properly configured for token transmission
4. **Token Validation**: JWT strategy needs improvements for better token handling

## Issues Identified

### 1. JWT Expiration Time

- **Current**: `JWT_ACCESS_EXPIRES_IN=15m` (15 minutes)
- **Problem**: Too short for good user experience
- **Solution**: Change to `JWT_ACCESS_EXPIRES_IN=7d` (7 days)

### 2. Environment Variable Mismatch

- **Issue**: `start-local-backend.ts` sets `JWT_EXPIRES_IN` but auth module looks for `JWT_ACCESS_EXPIRES_IN`
- **Status**: ✅ Fixed in this update

### 3. CORS Configuration

- **Issue**: CORS was not properly configured for credentials and headers
- **Status**: ✅ Fixed in this update

### 4. JWT Strategy

- **Issue**: JWT strategy needed improvements for better token validation
- **Status**: ✅ Fixed in this update

## Files Modified

### Backend Code Changes

1. **`src/modules/auth/auth.module.ts`**
   - Changed default JWT expiration from `1d` to `7d`

2. **`src/modules/auth/strategies/jwt.strategy.ts`**
   - Added `userId` field for compatibility with guards
   - Improved token validation

3. **`src/main.ts`**
   - Fixed CORS configuration to allow credentials
   - Added proper headers and methods

4. **`scripts/start-local-backend.ts`**
   - Fixed environment variable name from `JWT_EXPIRES_IN` to `JWT_ACCESS_EXPIRES_IN`

## Environment Variables to Update

### Update these files:

- `.env.stage`
- `.env.production`
- `.env.development`
- `.env`

### Change this line:

```bash
# From:
JWT_ACCESS_EXPIRES_IN=15m

# To:
JWT_ACCESS_EXPIRES_IN=7d
```

## Frontend Issues to Fix

### 1. Token Storage

After successful registration/login, the frontend must:

```javascript
// Store token in localStorage
localStorage.setItem("access_token", response.data.access_token);

// Or in sessionStorage for session-only storage
sessionStorage.setItem("access_token", response.data.access_token);
```

### 2. Token Transmission

For all authenticated requests, the frontend must:

```javascript
// Include token in Authorization header
const token = localStorage.getItem("access_token");
const headers = {
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
};

// Use in requests
axios.get("/api/auth/me", { headers });
```

### 3. Token Refresh

Implement token refresh logic:

```javascript
// Check if token is expired
const token = localStorage.getItem("access_token");
if (token && isTokenExpired(token)) {
  // Refresh token or redirect to login
  await refreshToken();
}
```

## Testing the Fix

### Run the authentication test:

```bash
npm run fix:auth
```

### Test individual components:

```bash
npm run test:jwt:simple    # Test JWT generation
npm run test:auth          # Test complete auth flow
npm run check:env          # Check environment variables
```

## Expected Behavior After Fix

1. **Registration**: User gets JWT token valid for 7 days
2. **Authentication**: Token is properly validated on protected endpoints
3. **CORS**: Frontend can send Authorization headers without issues
4. **Token Expiration**: Tokens last long enough for good UX

## Troubleshooting

### If tokens still expire quickly:

1. Check environment variables are properly loaded
2. Restart the backend after changing environment variables
3. Verify no other environment files are overriding the settings

### If CORS errors persist:

1. Check browser console for CORS errors
2. Verify frontend origin is in CORS_ORIGINS
3. Ensure credentials are enabled in frontend requests

### If authentication still fails:

1. Check browser Network tab for Authorization headers
2. Verify token is stored in localStorage/sessionStorage
3. Check backend logs for authentication errors

## Security Considerations

1. **Token Storage**: Consider using httpOnly cookies for production
2. **Token Expiration**: 7 days is reasonable for development, consider shorter for production
3. **Refresh Tokens**: Implement refresh token mechanism for production
4. **HTTPS**: Ensure HTTPS is used in production for secure token transmission

## Next Steps

1. ✅ Update environment variables
2. ✅ Restart backend
3. 🔄 Test authentication flow
4. 🔄 Fix frontend token handling
5. 🔄 Test complete user flow
6. 🔄 Deploy to staging/production
