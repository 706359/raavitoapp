# EAS Build Fix - App Not Loading After Splash Screen

## Problem
When running the app from EAS on Expo Go, the app gets stuck after the splash screen and doesn't load. This is because:

1. **Hardcoded Local IP Address**: The API base URL was hardcoded to `http://192.168.1.50:5050/api/`, which is only accessible on your local network. When running on a device via EAS, it can't reach this local IP.

2. **Hanging API Calls**: The `AuthContext` was trying to verify the user token on startup by calling `/auth/me`, but this call would hang indefinitely when it couldn't reach the backend, preventing the app from loading.

## Solution

### 1. Environment-Based API URL Configuration
Updated `app/utils/utils.js` to support environment variables:
- Priority 1: `EXPO_PUBLIC_API_URL` environment variable
- Priority 2: `app.json` extra config (for EAS builds)
- Priority 3: Local development IP (only in `__DEV__` mode)
- Priority 4: Production API URL (default fallback)

### 2. Timeout Handling
- Added 10-second timeout to all axios requests
- Added 8-second timeout to the token verification call in `AuthContext`
- Prevents the app from hanging indefinitely

### 3. Network Error Handling
- Improved error handling in `AuthContext` to detect network errors
- Falls back to saved user data for offline mode when network is unavailable
- Only clears storage on actual authentication errors (401, 403), not network errors

### 4. Fixed Hardcoded URLs
- Updated `app/app/api/index.js` to use the centralized axios instance instead of hardcoded fetch URL

## How to Use

### For Local Development
1. Create a `.env` file in the `app` directory (optional):
   ```
   EXPO_PUBLIC_API_URL=http://192.168.1.50:5050/api/
   ```

### For EAS Builds (Production/Preview)
1. **Option 1: Environment Variable (Recommended)**
   - Set `EXPO_PUBLIC_API_URL` in your EAS build secrets:
     ```bash
     eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value https://your-production-api.com/api/
     ```

2. **Option 2: Update Default in Code**
   - Edit `app/utils/utils.js` and replace the production URL:
     ```javascript
     return 'https://your-production-api.com/api/';
     ```

### For Testing with Expo Go
If you want to test with Expo Go while your backend is running locally:

1. Make sure your phone/device is on the same WiFi network as your development machine
2. Find your computer's local IP address (e.g., `192.168.1.50`)
3. Update the API URL in `app/utils/utils.js` or set `EXPO_PUBLIC_API_URL` environment variable
4. Make sure your backend is accessible from your local network (not just localhost)

**Note**: For production, you should deploy your backend to a public URL (e.g., Heroku, AWS, Railway, etc.) and use that URL in your EAS builds.

## Testing
After making these changes:
1. The app should now load even if the backend is unreachable
2. Network errors will be handled gracefully
3. The app will show the login screen if no valid token is found
4. Saved user data will be used for offline mode when network is unavailable

## Next Steps
1. Deploy your backend to a public URL (if not already done)
2. Update the production API URL in the code or set it as an EAS secret
3. Rebuild your app with EAS
4. Test the app to ensure it connects to your backend correctly

