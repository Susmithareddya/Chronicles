// Vercel API route for specific ElevenLabs conversation
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { id: conversationId } = req.query;

  if (!conversationId) {
    return res.status(400).json({ error: 'Conversation ID is required' });
  }

  console.log(`🔄 Fetching conversation: ${conversationId}`);

  try {
    const ELEVENLABS_API_KEY = process.env.VITE_ELEVEN_LABS_API_KEY;

    if (!ELEVENLABS_API_KEY) {
      return res.status(500).json({
        error: 'ElevenLabs API key not configured'
      });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`,
      {
        method: 'GET',
        headers: {
          'xi-api-key': ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'User-Agent': 'Chronicles-Vercel-API/1.0',
        },
      }
    );

    console.log(`📡 ElevenLabs API response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ElevenLabs API error: ${response.status} - ${errorText}`);

      return res.status(response.status).json({
        error: `ElevenLabs API error: ${response.status} ${response.statusText}`,
        details: errorText,
        endpoint: `conversations/${conversationId}`
      });
    }

    const data = await response.json();
    console.log(`✅ Found conversation ${conversationId} with ${data.transcript?.length || 0} messages`);

    res.json(data);

  } catch (error) {
    console.error('❌ Vercel API error:', error);
    res.status(500).json({
      error: 'Vercel API server error',
      details: error.message
    });
  }
}