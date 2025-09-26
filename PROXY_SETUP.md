# 🚀 Proxy Server Setup for CORS Bypass

The CORS and 404 errors you're seeing require a server-side proxy to access the ElevenLabs API. Here's how to set it up:

## 🔧 Quick Setup

### 1. Install Server Dependencies

Open a terminal in the `C:\Personal\Chronicles` directory and run:

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install
```

### 2. Start the Proxy Server

```bash
# Start the proxy server
npm start
```

The server will start on `http://localhost:3001` and show:
```
🚀 Chronicles Proxy Server running on http://localhost:3001
📡 Health check: http://localhost:3001/health
🔧 Test APIs: http://localhost:3001/api/test
```

### 3. Verify Server is Running

Open your browser and go to:
- `http://localhost:3001/health` - Should show server status
- `http://localhost:3001/api/test` - Should show API connectivity

### 4. Test in Your App

1. Make sure both servers are running:
   - **Main app**: `http://localhost:5173` (or your Vite dev server)
   - **Proxy server**: `http://localhost:3001`

2. Go to `/conversation-sync` in your app

3. Use the "WebSocket Bypass" section:
   - Click "🔧 Test Proxy Server" first
   - Then "👥 List Available Agents" to find your correct agent ID
   - Finally "🚀 Try Direct Fetch" to sync conversations

## 📋 Manual Commands

If you prefer to set up manually:

```bash
# Create server directory if it doesn't exist
mkdir -p server

# Navigate to server directory
cd server

# Create package.json
npm init -y

# Install required dependencies
npm install express cors dotenv node-fetch@2

# Install development dependencies
npm install --save-dev nodemon

# Start the server
node proxy-server.js
```

## 🔍 Troubleshooting

### Problem: "Cannot GET /health"
**Solution**: The proxy server isn't running. Run `npm start` in the `server` directory.

### Problem: "ElevenLabs API key not configured"
**Solution**: Check that your `.env` file has the correct `VITE_ELEVEN_LABS_API_KEY`.

### Problem: "404 Not Found" from ElevenLabs
**Solution**: Your agent ID might be incorrect. Use "👥 List Available Agents" to find the right one.

### Problem: Port 3001 already in use
**Solution**: Either stop the other process or change the port:
```bash
PROXY_PORT=3002 npm start
```

## 🎯 Why This Works

1. **CORS Issue**: Browsers block direct calls to ElevenLabs API due to CORS policy
2. **Our Solution**: Node.js proxy server acts as a middleman
3. **Flow**: Browser → Proxy Server → ElevenLabs API → Proxy Server → Browser
4. **Result**: No CORS issues, and we can properly handle API responses

## 🚀 Production Setup

For production, you'd want to:
1. Deploy the proxy server to a cloud service (Heroku, Railway, etc.)
2. Update `VITE_PROXY_SERVER_URL` in your `.env` to point to the deployed server
3. Secure the proxy with authentication if needed

## 🎯 What Each Button Does

- **🔧 Test Proxy Server**: Checks if proxy is running and APIs are accessible
- **👥 List Available Agents**: Shows all your ElevenLabs agents with their IDs
- **🚀 Try Direct Fetch**: Syncs conversations using the proxy server
- **📡 Try XMLHttpRequest**: Alternative method if fetch fails
- **✏️ Manual Input**: Fallback for pasting JSON data directly

After setup, your conversations will sync successfully from ElevenLabs to Supabase! 🎉