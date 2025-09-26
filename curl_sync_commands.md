# 🚀 Curl Commands for WebSocket Bypass

If the browser WebSocket issues persist, use these curl commands directly from your terminal:

## 1. Get Conversations from ElevenLabs

```bash
# Replace YOUR_AGENT_ID with your actual agent ID
curl -X GET "https://api.elevenlabs.io/v1/convai/agents/agent_4301k60jbejbebzr750zdg463tr4/conversations" \
  -H "Authorization: Bearer sk_85ddcc89f690014a27f0bab3b0d67edf06d34bfbca2cddcc" \
  -H "Content-Type: application/json" \
  -o conversations.json
```

## 2. View the Downloaded Data

```bash
# Check what we downloaded
cat conversations.json | jq '.' # If you have jq installed
# OR
cat conversations.json # Without jq
```

## 3. Alternative: Get Single Conversation

```bash
# Get a specific conversation by ID (replace CONVERSATION_ID)
curl -X GET "https://api.elevenlabs.io/v1/convai/conversations/CONVERSATION_ID" \
  -H "Authorization: Bearer sk_85ddcc89f690014a27f0bab3b0d67edf06d34bfbca2cddcc" \
  -H "Content-Type: application/json"
```

## 4. Generate Embedding (Optional)

```bash
# Generate embedding for conversation text
curl -X POST "https://api.openai.com/v1/embeddings" \
  -H "Authorization: Bearer YOUR_OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "text-embedding-3-small",
    "input": "Your conversation text here...",
    "encoding_format": "float"
  }'
```

## 5. Store in Supabase (via REST API)

```bash
# Insert into Supabase using REST API
curl -X POST "https://dhzzbyrmgvmzhwngkrag.supabase.co/rest/v1/conversations" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenpieXJtZ3Ztemh3bmdrcmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjM3NzcsImV4cCI6MjA3NDM5OTc3N30.o6rfymSjSbOnETH7b7jjzTyz0CSeVfp9Z22Zr2tO6jI" \
  -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenpieXJtZ3Ztemh3bmdrcmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjM3NzcsImV4cCI6MjA3NDM5OTc3N30.o6rfymSjSbOnETH7b7jjzTyz0CSeVfp9Z22Zr2tO6jI" \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_text": "Your formatted conversation text here...",
    "conversation_data": {
      "message_count": 5,
      "participants": 2,
      "imported_at": "2025-01-26T10:00:00Z"
    },
    "metadata": {
      "agent_id": "agent_4301k60jbejbebzr750zdg463tr4",
      "session_id": "conversation_id_here",
      "tags": ["retirement_knowledge", "manual_import"]
    }
  }'
```

## 6. Complete Bash Script

Create a file called `sync_conversations.sh`:

```bash
#!/bin/bash

ELEVENLABS_API_KEY="sk_85ddcc89f690014a27f0bab3b0d67edf06d34bfbca2cddcc"
OPENAI_API_KEY="your-openai-key-here"
SUPABASE_URL="https://dhzzbyrmgvmzhwngkrag.supabase.co"
SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRoenpieXJtZ3Ztemh3bmdrcmFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg4MjM3NzcsImV4cCI6MjA3NDM5OTc3N30.o6rfymSjSbOnETH7b7jjzTyz0CSeVfp9Z22Zr2tO6jI"
AGENT_ID="agent_4301k60jbejbebzr750zdg463tr4"

echo "🚀 Fetching conversations from ElevenLabs..."

# Get conversations
curl -X GET "https://api.elevenlabs.io/v1/convai/agents/$AGENT_ID/conversations" \
  -H "Authorization: Bearer $ELEVENLABS_API_KEY" \
  -H "Content-Type: application/json" \
  -o conversations.json

if [ $? -eq 0 ]; then
    echo "✅ Successfully downloaded conversations"

    # Check if file has data
    if [ -s conversations.json ]; then
        echo "📊 File size: $(wc -c < conversations.json) bytes"
        echo "📝 Content preview:"
        head -n 20 conversations.json

        echo ""
        echo "💾 To import this data:"
        echo "1. Copy the content of conversations.json"
        echo "2. Go to your app's /conversation-sync page"
        echo "3. Use the 'Manual Data Input' section in the WebSocket Bypass"
        echo "4. Paste the JSON data and click 'Import Manual Data'"
    else
        echo "⚠️  Downloaded file is empty"
    fi
else
    echo "❌ Failed to download conversations"
fi
```

Make it executable and run:
```bash
chmod +x sync_conversations.sh
./sync_conversations.sh
```

## 7. PowerShell Version (Windows)

```powershell
# PowerShell script for Windows users
$headers = @{
    "Authorization" = "Bearer sk_85ddcc89f690014a27f0bab3b0d67edf06d34bfbca2cddcc"
    "Content-Type" = "application/json"
}

$agentId = "agent_4301k60jbejbebzr750zdg463tr4"
$url = "https://api.elevenlabs.io/v1/convai/agents/$agentId/conversations"

Write-Host "🚀 Fetching conversations from ElevenLabs..." -ForegroundColor Green

try {
    $response = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
    $response | ConvertTo-Json -Depth 10 | Out-File -FilePath "conversations.json" -Encoding UTF8

    Write-Host "✅ Successfully downloaded conversations to conversations.json" -ForegroundColor Green
    Write-Host "📝 Found $($response.conversations.Count) conversations" -ForegroundColor Cyan

    Write-Host "💾 To import this data:" -ForegroundColor Yellow
    Write-Host "1. Open conversations.json file"
    Write-Host "2. Copy all the content"
    Write-Host "3. Go to your app's /conversation-sync page"
    Write-Host "4. Use the 'Manual Data Input' section"
    Write-Host "5. Paste and click 'Import Manual Data'"

} catch {
    Write-Host "❌ Failed to download conversations: $($_.Exception.Message)" -ForegroundColor Red
}
```

## Usage Instructions

1. **Choose your method:**
   - Use curl commands directly in terminal/command prompt
   - Save and run the bash script (Linux/Mac)
   - Use PowerShell script (Windows)

2. **Download the data** using any of the above methods

3. **Import via UI:**
   - Go to `/conversation-sync` in your app
   - Use the red "WebSocket Bypass" section at the top
   - Copy the downloaded JSON data
   - Paste into "Manual Data Input"
   - Click "Import Manual Data"

4. **Verify the import:**
   - Use the "Conversation Verifier" section below
   - Click "Refresh" to see your imported data

This completely bypasses any WebSocket or browser issues and gets your data directly into Supabase!