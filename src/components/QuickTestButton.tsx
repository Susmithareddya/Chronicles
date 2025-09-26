import React, { useState } from 'react';

export const QuickTestButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleQuickTest = async () => {
    setIsLoading(true);
    setResult(null);

    try {
      // Your dummy conversation data
      const dummyConversation = {
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

      // Call the webhook endpoint
      const response = await fetch('http://localhost:3004/api/test-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setResult(`✅ SUCCESS!

Conversation processed and stored with:
- Message count: ${data.result.message_count}
- Stored ID: ${data.result.stored_id}
- Has embedding: ${data.result.has_embedding ? 'YES' : 'NO'}
- Conversation ID: ${data.result.conversation_id}

The dummy conversation is now in your Supabase vector database!`);
      } else {
        setResult(`❌ FAILED: ${data.error || 'Unknown error'}`);
      }

    } catch (error) {
      setResult(`❌ ERROR: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
      <h2 className="text-xl font-bold text-yellow-800 mb-4">
        🚀 Quick Test Button
      </h2>

      <p className="text-yellow-700 mb-4">
        Click to process the dummy conversation, create embeddings, and store in Supabase
      </p>

      <button
        onClick={handleQuickTest}
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg ${
          isLoading
            ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
            : 'bg-yellow-600 text-white hover:bg-yellow-700 cursor-pointer'
        }`}
      >
        {isLoading ? '🔄 Processing...' : '🧪 Process Dummy Conversation'}
      </button>

      {result && (
        <div className={`mt-4 p-4 rounded-lg whitespace-pre-line ${
          result.startsWith('✅')
            ? 'bg-green-100 border border-green-300 text-green-800'
            : 'bg-red-100 border border-red-300 text-red-800'
        }`}>
          {result}
        </div>
      )}

      <div className="mt-4 p-3 bg-blue-100 border border-blue-300 rounded text-blue-800 text-sm">
        <strong>What this does:</strong>
        <ul className="mt-1 list-disc list-inside space-y-1">
          <li>Takes your dummy conversation data</li>
          <li>Formats it into readable text</li>
          <li>Generates vector embeddings (if OpenAI key is set)</li>
          <li>Stores everything in Supabase</li>
        </ul>
      </div>
    </div>
  );
};