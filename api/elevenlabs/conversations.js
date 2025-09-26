// Vercel API route for ElevenLabs conversations list
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

  const { agent_id, page_size = 30, cursor, call_successful } = req.query;

  console.log(`🔄 Fetching conversations list${agent_id ? ` for agent: ${agent_id}` : ''}`);

  try {
    const ELEVENLABS_API_KEY = process.env.VITE_ELEVEN_LABS_API_KEY;

    if (!ELEVENLABS_API_KEY) {
      return res.status(500).json({
        error: 'ElevenLabs API key not configured'
      });
    }

    // Build query parameters
    const params = new URLSearchParams();
    if (agent_id) params.append('agent_id', agent_id);
    if (page_size) params.append('page_size', page_size.toString());
    if (cursor) params.append('cursor', cursor);
    if (call_successful) params.append('call_successful', call_successful);

    const url = `https://api.elevenlabs.io/v1/convai/conversations?${params}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'xi-api-key': ELEVENLABS_API_KEY,
        'Content-Type': 'application/json',
        'User-Agent': 'Chronicles-Vercel-API/1.0',
      },
    });

    console.log(`📡 ElevenLabs API response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ElevenLabs API error: ${response.status} - ${errorText}`);

      return res.status(response.status).json({
        error: `ElevenLabs API error: ${response.status} ${response.statusText}`,
        details: errorText,
        endpoint: 'conversations'
      });
    }

    const data = await response.json();
    console.log(`✅ Found ${data.conversations?.length || 0} conversations`);

    res.json(data);

  } catch (error) {
    console.error('❌ Vercel API error:', error);
    res.status(500).json({
      error: 'Vercel API server error',
      details: error.message
    });
  }
}