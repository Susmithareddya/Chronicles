const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config({ path: '../.env' });

// Supabase configuration
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

const app = express();
const PORT = process.env.PROXY_PORT || 3001;

// Environment variables
const ELEVENLABS_API_KEY = process.env.VITE_ELEVEN_LABS_API_KEY;
const OPENAI_API_KEY = process.env.VITE_OPENAI_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Process conversation data and store in Supabase
async function processConversationToSupabase(conversationData) {
  console.log('🔄 Processing conversation for Supabase storage...');

  try {
    // Format conversation text
    const conversationText = formatConversationText(conversationData);

    // Generate embedding if OpenAI key is available
    let embedding = null;
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here') {
      try {
        embedding = await generateEmbedding(conversationText);
        console.log('✅ Generated embedding with', embedding ? embedding.length : 0, 'dimensions');
      } catch (embError) {
        console.warn('⚠️ Embedding generation failed:', embError.message);
      }
    } else {
      console.log('⚠️ OpenAI API key not configured, storing without embedding');
    }

    // Prepare metadata
    const metadata = {
      user_id: conversationData.user_id,
      session_id: conversationData.conversation_id,
      agent_id: conversationData.agent_id,
      created_at: new Date(conversationData.metadata?.start_time_unix_secs * 1000).toISOString(),
      duration_seconds: conversationData.metadata?.call_duration_secs,
      status: conversationData.status,
      termination_reason: conversationData.metadata?.termination_reason,
      language: conversationData.metadata?.main_language || 'en',
      source: conversationData.metadata?.conversation_initiation_source || 'webhook',
      tags: ['knowledge_transfer', 'webhook_import', 'auto_processed'],
      call_successful: conversationData.analysis?.call_successful,
      summary_title: conversationData.analysis?.call_summary_title
    };

    // Prepare conversation data
    const conversationDataForStorage = {
      original_conversation: conversationData,
      message_count: conversationData.transcript?.length || 0,
      participants: new Set(conversationData.transcript?.map(m => m.role) || []).size,
      imported_at: new Date().toISOString(),
      import_method: 'webhook_auto',
      cost: conversationData.metadata?.cost,
      transcript_summary: conversationData.analysis?.transcript_summary
    };

    // Store in Supabase
    const response = await fetch(`${SUPABASE_URL}/rest/v1/conversations`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        conversation_text: conversationText,
        conversation_data: conversationDataForStorage,
        embedding: embedding,
        metadata: metadata,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`Supabase error: ${response.status} - ${errorData.message || response.statusText}`);
    }

    const storedData = await response.json();
    const storedId = storedData[0]?.id;

    console.log(`✅ Successfully stored conversation ${conversationData.conversation_id} -> ${storedId}`);

    return {
      success: true,
      stored_id: storedId,
      has_embedding: !!embedding,
      message_count: conversationData.transcript?.length || 0,
      conversation_id: conversationData.conversation_id
    };

  } catch (error) {
    console.error('❌ Error processing conversation:', error);
    throw error;
  }
}

// Format conversation data into readable text
function formatConversationText(conversationData) {
  const messages = conversationData.transcript || [];

  const formattedMessages = messages.map((message, index) => {
    const timestamp = conversationData.metadata?.start_time_unix_secs
      ? new Date((conversationData.metadata.start_time_unix_secs + message.time_in_call_secs) * 1000).toLocaleString()
      : new Date().toLocaleString();

    const speaker = message.role === 'agent' ? 'Agent' : 'User';
    const content = message.message || message.content || '';

    return `[${timestamp}] ${speaker}: ${content}`;
  }).join('\n\n');

  // Add conversation metadata as header
  const header = [
    `=== Conversation: ${conversationData.analysis?.call_summary_title || 'Knowledge Transfer Session'} ===`,
    `Session ID: ${conversationData.conversation_id}`,
    `Agent ID: ${conversationData.agent_id}`,
    `Duration: ${conversationData.metadata?.call_duration_secs || 0} seconds`,
    `Status: ${conversationData.status}`,
    `Summary: ${conversationData.analysis?.transcript_summary || 'No summary available'}`,
    '',
    '=== Messages ==='
  ].join('\n');

  return `${header}\n\n${formattedMessages}`;
}

// Generate embedding using OpenAI API
async function generateEmbedding(text) {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
    return null;
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text.substring(0, 8000), // Truncate to avoid token limits
      encoding_format: 'float',
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    hasElevenLabsKey: !!ELEVENLABS_API_KEY,
    hasOpenAIKey: !!OPENAI_API_KEY
  });
});

// ElevenLabs API proxy endpoints

// Get all conversations for an agent
app.get('/api/elevenlabs/agents/:agentId/conversations', async (req, res) => {
  const { agentId } = req.params;

  console.log(`🔄 Fetching conversations for agent: ${agentId}`);

  try {
    if (!ELEVENLABS_API_KEY) {
      return res.status(500).json({
        error: 'ElevenLabs API key not configured'
      });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/agents/${agentId}/conversations`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ELEVENLABS_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Chronicles-Proxy-Server/1.0',
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
        endpoint: `agents/${agentId}/conversations`
      });
    }

    const data = await response.json();
    console.log(`✅ Found ${data.conversations?.length || 0} conversations`);

    res.json(data);

  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({
      error: 'Proxy server error',
      details: error.message
    });
  }
});

// Get a specific conversation
app.get('/api/elevenlabs/conversations/:conversationId', async (req, res) => {
  const { conversationId } = req.params;

  console.log(`🔄 Fetching conversation: ${conversationId}`);

  try {
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
          'Authorization': `Bearer ${ELEVENLABS_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Chronicles-Proxy-Server/1.0',
        },
      }
    );

    console.log(`📡 ElevenLabs API response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `ElevenLabs API error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log(`✅ Retrieved conversation: ${data.id}`);

    res.json(data);

  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({
      error: 'Proxy server error',
      details: error.message
    });
  }
});

// List available agents (to help find the right agent ID)
app.get('/api/elevenlabs/agents', async (req, res) => {
  console.log(`🔄 Fetching available agents`);

  try {
    if (!ELEVENLABS_API_KEY) {
      return res.status(500).json({
        error: 'ElevenLabs API key not configured'
      });
    }

    const response = await fetch(
      'https://api.elevenlabs.io/v1/convai/agents',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ELEVENLABS_API_KEY}`,
          'Content-Type': 'application/json',
          'User-Agent': 'Chronicles-Proxy-Server/1.0',
        },
      }
    );

    console.log(`📡 ElevenLabs API response: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `ElevenLabs API error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log(`✅ Found ${data.agents?.length || 0} agents`);

    res.json(data);

  } catch (error) {
    console.error('❌ Proxy error:', error);
    res.status(500).json({
      error: 'Proxy server error',
      details: error.message
    });
  }
});

// OpenAI embedding proxy
app.post('/api/openai/embeddings', async (req, res) => {
  const { text } = req.body;

  console.log(`🔄 Generating embedding for text (${text?.length || 0} chars)`);

  try {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
      return res.status(500).json({
        error: 'OpenAI API key not configured'
      });
    }

    const response = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: text.substring(0, 8000), // Truncate to avoid token limits
        encoding_format: 'float',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({
        error: `OpenAI API error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log(`✅ Generated embedding with ${data.data[0].embedding.length} dimensions`);

    res.json({ embedding: data.data[0].embedding });

  } catch (error) {
    console.error('❌ Embedding error:', error);
    res.status(500).json({
      error: 'Embedding generation error',
      details: error.message
    });
  }
});

// Webhook endpoint to receive conversation data from ElevenLabs
app.post('/webhook/conversation', async (req, res) => {
  const conversationData = req.body;

  console.log('🔔 Received conversation webhook:', {
    conversation_id: conversationData.conversation_id,
    agent_id: conversationData.agent_id,
    status: conversationData.status,
    user_id: conversationData.user_id
  });

  try {
    // Process the conversation and store in Supabase
    const result = await processConversationToSupabase(conversationData);

    console.log('✅ Successfully processed conversation:', result);

    res.json({
      success: true,
      message: 'Conversation processed successfully',
      stored_id: result.stored_id,
      has_embedding: result.has_embedding
    });

  } catch (error) {
    console.error('❌ Error processing conversation webhook:', error);

    res.status(500).json({
      success: false,
      error: error.message,
      conversation_id: conversationData.conversation_id
    });
  }
});

// Test endpoint with sample conversation data
app.post('/api/test-conversation', async (req, res) => {
  console.log('🧪 Testing conversation processing...');

  // Sample conversation data from your example
  const sampleConversation = {
    agent_id: 'agent_4301k60jbejbebzr750zdg463tr4',
    conversation_id: 'conv_4201k60q1xc2fvfs97e0htbxpn4g',
    status: 'done',
    user_id: '4ZnAfbv0YOXOXPhpajpXbSUvISi1',
    transcript: [
      {
        role: 'agent',
        agent_metadata: {
          agent_id: 'agent_4301k60jbejbebzr750zdg463tr4',
          workflow_node_id: 'node_01k60kbpywf6dtaba62p3689rb'
        },
        message: 'Good Day! I am your knowledge transfer agent. Before we start could you please state your designation in the company. Feel free to add more information about your job which might be useful for future employees',
        time_in_call_secs: 0,
        interrupted: true,
        original_message: 'Good Day! I am your knowledge transfer agent. Before we start could you please state your designation in the company. Feel free to add more information about your job which might be useful for future employees'
      },
      {
        role: 'user',
        message: 'This is a test.',
        time_in_call_secs: 6,
        interrupted: false,
        source_medium: 'audio'
      },
      {
        role: 'agent',
        agent_metadata: {
          agent_id: 'agent_4301k60jbejbebzr750zdg463tr4',
          workflow_node_id: 'node_01k60kbpywf6dtaba62p3689rb'
        },
        message: "I understand this is a test session. That's perfectly fine! Even in a test environment, I can help demonstrate how knowledge transfer interviews work. Could you tell me what role or position you'd like to simulate for this test?",
        time_in_call_secs: 11,
        interrupted: true,
        original_message: "I understand this is a test session. That's perfectly fine! Even in a test environment, I can help demonstrate how knowledge transfer interviews work.\n\nCould you tell me what role or position you'd like to simulate for this test? For example, are you thinking of a software developer, project manager, sales representative, or another type of role? This will help me ask relevant questions about the kind of knowledge and processes someone in that position might have."
      }
    ],
    metadata: {
      start_time_unix_secs: 1758813287,
      accepted_time_unix_secs: 1758813288,
      call_duration_secs: 18,
      cost: 107,
      termination_reason: 'Client disconnected: 1005',
      main_language: 'en',
      conversation_initiation_source: 'react_sdk',
      conversation_initiation_source_version: '0.5.0'
    },
    analysis: {
      call_successful: 'success',
      transcript_summary: "The agent introduces itself as a knowledge transfer agent and asks for the user's designation. The user clarifies that it is a test. The agent acknowledges this and offers to demonstrate its capabilities.",
      call_summary_title: 'Knowledge transfer agent test'
    }
  };

  try {
    const result = await processConversationToSupabase(sampleConversation);

    res.json({
      success: true,
      message: 'Test conversation processed successfully',
      result: result
    });

  } catch (error) {
    console.error('❌ Test conversation processing failed:', error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Test endpoint to verify API connectivity
app.get('/api/test', async (req, res) => {
  const results = {
    elevenlabs: { available: false, error: null },
    openai: { available: false, error: null }
  };

  // Test ElevenLabs API
  try {
    if (ELEVENLABS_API_KEY) {
      const response = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: { 'Authorization': `Bearer ${ELEVENLABS_API_KEY}` }
      });
      results.elevenlabs.available = response.ok;
      if (!response.ok) {
        results.elevenlabs.error = `${response.status} ${response.statusText}`;
      }
    } else {
      results.elevenlabs.error = 'API key not configured';
    }
  } catch (error) {
    results.elevenlabs.error = error.message;
  }

  // Test OpenAI API
  try {
    if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here') {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
      });
      results.openai.available = response.ok;
      if (!response.ok) {
        results.openai.error = `${response.status} ${response.statusText}`;
      }
    } else {
      results.openai.error = 'API key not configured';
    }
  } catch (error) {
    results.openai.error = error.message;
  }

  res.json(results);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('❌ Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error', details: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Chronicles Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 Test APIs: http://localhost:${PORT}/api/test`);
  console.log(`📋 Available endpoints:`);
  console.log(`   GET  /api/elevenlabs/agents`);
  console.log(`   GET  /api/elevenlabs/agents/:agentId/conversations`);
  console.log(`   GET  /api/elevenlabs/conversations/:conversationId`);
  console.log(`   POST /api/openai/embeddings`);
  console.log(`\n🔑 Environment check:`);
  console.log(`   ElevenLabs API Key: ${ELEVENLABS_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`   OpenAI API Key: ${OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here' ? '✅ Configured' : '❌ Missing'}`);
});

module.exports = app;