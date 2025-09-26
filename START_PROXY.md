# 🚀 Start Proxy Server for ElevenLabs Testing

The CORS errors you're seeing are because browsers block direct API calls to ElevenLabs from localhost. The proxy server solves this by handling the API calls server-side.

## 🔧 Start the Proxy Server

### Option 1: Command Line
```bash
# Navigate to server directory
cd server

# Install dependencies (if not already done)
npm install

# Start the proxy server
npm start
```

### Option 2: Development Mode (with auto-restart)
```bash
cd server
npm run dev
```

## 🌐 Verify Proxy is Running

1. **Open a new terminal/command prompt**
2. **Check health endpoint:**
   ```bash
   curl http://localhost:3001/health
   ```
   OR visit: http://localhost:3001/health

3. **You should see:**
   ```json
   {
     "status": "OK",
     "timestamp": "2025-09-26T...",
     "services": {
       "elevenlabs": { "available": true, "error": null },
       "openai": { "available": true, "error": null },
       "supabase": { "available": true, "error": null }
     }
   }
   ```

## 🧪 Test Your Enhanced Access

Once the proxy is running:

1. **Go back to your Chronicles app:** http://localhost:8080/conversation-sync
2. **Click "Test Transcript Capture"**
3. **The test should now work without CORS errors!**

## 🔍 What the Proxy Does

- **Handles CORS:** Server-side requests bypass browser CORS restrictions
- **Manages Auth:** Securely uses your ElevenLabs API key server-side
- **Error Handling:** Better error messages and debugging
- **Rate Limiting:** Prevents API overuse

## 🐛 Troubleshooting

### Proxy won't start:
- Check if port 3001 is already in use
- Verify your `.env` file has `VITE_ELEVEN_LABS_API_KEY`

### API still fails:
- Check console logs in proxy terminal
- Verify your ElevenLabs API key is correct
- Check if your agent ID is valid

### Wrong agent ID?
- Visit: http://localhost:3001/api/elevenlabs/agents
- This will list all your available agents

## 💡 Environment Variables

Make sure your `.env` file has:
```
VITE_ELEVEN_LABS_API_KEY=your_actual_api_key_here
VITE_USE_PROXY=true
VITE_PROXY_URL=http://localhost:3001
```

## 🎯 Next Steps

After starting the proxy:
1. ✅ Test Transcript Capture should work
2. ✅ Test Integration should pass
3. ✅ Test Real-time Sync should sync conversations

Your enhanced ElevenLabs access will be fully testable!