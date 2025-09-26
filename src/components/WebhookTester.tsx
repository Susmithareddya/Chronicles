import React, { useState } from 'react';

export const WebhookTester: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [webhookUrl, setWebhookUrl] = useState('http://localhost:3004');

  const testWebhook = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${webhookUrl}/api/test-conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        status: response.status,
        data: data,
        timestamp: new Date().toISOString(),
      });

      if (response.ok) {
        alert('✅ Conversation processed successfully!');
      } else {
        alert(`❌ Processing failed: ${data.error}`);
      }

    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
      alert(`❌ Request failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testManualWebhook = async () => {
    setIsLoading(true);
    setResult(null);

    // Sample conversation data (same as in your example)
    const sampleData = {
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
          interrupted: true
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
          interrupted: true
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
      const response = await fetch(`${webhookUrl}/webhook/conversation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sampleData),
      });

      const data = await response.json();
      setResult({
        success: response.ok,
        status: response.status,
        data: data,
        timestamp: new Date().toISOString(),
      });

      if (response.ok) {
        alert(`✅ Webhook processed successfully! Stored ID: ${data.stored_id}`);
      } else {
        alert(`❌ Webhook failed: ${data.error}`);
      }

    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      });
      alert(`❌ Webhook request failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-green-50 border-2 border-green-200 rounded-lg">
      <h2 className="text-2xl font-bold text-green-800 mb-4">
        🔗 Automatic Webhook System
      </h2>
      <p className="text-green-700 mb-6">
        This system automatically receives conversation data when ElevenLabs conversations end
      </p>

      {/* Webhook URL Configuration */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Webhook Server URL:
        </label>
        <input
          type="text"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="http://localhost:3004"
          disabled={isLoading}
        />
      </div>

      {/* Test Buttons */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <button
          onClick={testWebhook}
          disabled={isLoading}
          className={`p-4 rounded-lg font-semibold text-center ${
            isLoading
              ? 'bg-gray-400 text-gray-200'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {isLoading ? '🔄 Testing...' : '🧪 Test Processing Pipeline'}
        </button>

        <button
          onClick={testManualWebhook}
          disabled={isLoading}
          className={`p-4 rounded-lg font-semibold text-center ${
            isLoading
              ? 'bg-gray-400 text-gray-200'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? '🔄 Testing...' : '🔗 Test Webhook Endpoint'}
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className={`p-4 rounded-lg ${
          result.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'
        }`}>
          <h3 className="font-semibold mb-2">
            {result.success ? '✅ Success' : '❌ Error'}
          </h3>

          <div className="mb-2">
            <strong>Status:</strong> {result.status || 'Network Error'}
          </div>

          <div className="mb-2">
            <strong>Time:</strong> {new Date(result.timestamp).toLocaleString()}
          </div>

          {result.data && (
            <div className="mb-2">
              <strong>Response:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-auto max-h-40">
                {JSON.stringify(result.data, null, 2)}
              </pre>
            </div>
          )}

          {result.error && (
            <div className="text-red-700">
              <strong>Error:</strong> {result.error}
            </div>
          )}
        </div>
      )}

      {/* Setup Instructions */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-3">📋 How This Works</h3>

        <div className="space-y-3 text-sm text-blue-700">
          <div>
            <strong>1. ElevenLabs Conversation Ends</strong>
            <div className="ml-4 text-blue-600">→ ElevenLabs calls your webhook automatically</div>
          </div>

          <div>
            <strong>2. Webhook Receives Data</strong>
            <div className="ml-4 text-blue-600">→ POST to <code>http://localhost:3004/webhook/conversation</code></div>
          </div>

          <div>
            <strong>3. Automatic Processing</strong>
            <div className="ml-4 text-blue-600">→ Formats conversation text</div>
            <div className="ml-4 text-blue-600">→ Generates vector embeddings (if OpenAI key available)</div>
            <div className="ml-4 text-blue-600">→ Stores in Supabase vector database</div>
          </div>

          <div>
            <strong>4. Confirmation Response</strong>
            <div className="ml-4 text-blue-600">→ Returns success/failure status to ElevenLabs</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded">
          <strong>⚠️ Current Issue:</strong> Supabase Row Level Security (RLS) is blocking inserts.
          <br />
          <strong>Quick Fix:</strong> Disable RLS for the conversations table in Supabase dashboard, or add a policy to allow inserts.
        </div>
      </div>

      {/* ElevenLabs Configuration */}
      <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
        <h3 className="font-semibold text-purple-800 mb-3">🔧 ElevenLabs Webhook Setup</h3>

        <div className="text-sm text-purple-700 space-y-2">
          <p><strong>Webhook URL:</strong> <code>http://localhost:3004/webhook/conversation</code></p>
          <p><strong>Method:</strong> POST</p>
          <p><strong>Trigger:</strong> Conversation End</p>

          <div className="mt-3 p-2 bg-purple-100 rounded">
            <strong>For Production:</strong> Replace localhost with your deployed server URL
          </div>
        </div>
      </div>
    </div>
  );
};