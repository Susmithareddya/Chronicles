/**
 * Direct API Service - Bypasses any WebSocket dependencies
 * This service makes direct HTTP calls to ElevenLabs API and Supabase
 */

const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const PROXY_SERVER_URL = import.meta.env.VITE_PROXY_SERVER_URL || 'http://localhost:3001';

export interface DirectSyncResult {
  success: boolean;
  method: string;
  conversationsFound: number;
  conversationsStored: number;
  errors: string[];
  details: any;
}

export class DirectApiService {

  /**
   * Method 1: Via Proxy Server (avoids CORS)
   */
  async syncViaDirectFetch(agentId: string = 'agent_4301k60jbejbebzr750zdg463tr4'): Promise<DirectSyncResult> {
    const result: DirectSyncResult = {
      success: false,
      method: 'Proxy Server',
      conversationsFound: 0,
      conversationsStored: 0,
      errors: [],
      details: {}
    };

    try {
      console.log('🔄 Method 1: Using proxy server bypass...');

      // Call via proxy server to avoid CORS issues
      const response = await fetch(`${PROXY_SERVER_URL}/api/elevenlabs/agents/${agentId}/conversations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      result.conversationsFound = data.conversations?.length || 0;
      result.details.apiResponse = data;

      if (result.conversationsFound > 0) {
        // Store directly without going through potentially problematic services
        const stored = await this.storeDirectlyToSupabase(data.conversations);
        result.conversationsStored = stored;
        result.success = stored > 0;
      } else {
        result.success = true; // No conversations to sync is still success
      }

    } catch (error) {
      result.errors.push(`Direct Fetch Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Method 2: Using XMLHttpRequest (sometimes bypasses fetch issues)
   */
  async syncViaXMLHttpRequest(agentId: string = 'agent_4301k60jbejbebzr750zdg463tr4'): Promise<DirectSyncResult> {
    const result: DirectSyncResult = {
      success: false,
      method: 'XMLHttpRequest',
      conversationsFound: 0,
      conversationsStored: 0,
      errors: [],
      details: {}
    };

    return new Promise((resolve) => {
      try {
        console.log('🔄 Method 2: Using XMLHttpRequest bypass...');

        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://api.elevenlabs.io/v1/convai/agents/${agentId}/conversations`, true);
        xhr.setRequestHeader('Authorization', `Bearer ${ELEVENLABS_API_KEY}`);
        xhr.setRequestHeader('Content-Type', 'application/json');

        xhr.onload = async () => {
          try {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              result.conversationsFound = data.conversations?.length || 0;
              result.details.apiResponse = data;

              if (result.conversationsFound > 0) {
                const stored = await this.storeDirectlyToSupabase(data.conversations);
                result.conversationsStored = stored;
                result.success = stored > 0;
              } else {
                result.success = true;
              }
            } else {
              result.errors.push(`XHR Error: ${xhr.status} - ${xhr.statusText}`);
            }
          } catch (error) {
            result.errors.push(`XHR Parse Error: ${error instanceof Error ? error.message : String(error)}`);
          }
          resolve(result);
        };

        xhr.onerror = () => {
          result.errors.push(`XHR Network Error: ${xhr.statusText}`);
          resolve(result);
        };

        xhr.send();

      } catch (error) {
        result.errors.push(`XHR Setup Error: ${error instanceof Error ? error.message : String(error)}`);
        resolve(result);
      }
    });
  }

  /**
   * Method 3: Manual conversation data input
   */
  async syncViaManualInput(conversationData: any): Promise<DirectSyncResult> {
    const result: DirectSyncResult = {
      success: false,
      method: 'Manual Input',
      conversationsFound: 0,
      conversationsStored: 0,
      errors: [],
      details: {}
    };

    try {
      console.log('🔄 Method 3: Using manual input bypass...');

      let conversations = [];

      if (typeof conversationData === 'string') {
        // Try to parse JSON string
        conversations = JSON.parse(conversationData);
      } else if (Array.isArray(conversationData)) {
        conversations = conversationData;
      } else if (conversationData.conversations) {
        conversations = conversationData.conversations;
      } else {
        conversations = [conversationData];
      }

      result.conversationsFound = conversations.length;

      if (conversations.length > 0) {
        const stored = await this.storeDirectlyToSupabase(conversations);
        result.conversationsStored = stored;
        result.success = stored > 0;
      }

    } catch (error) {
      result.errors.push(`Manual Input Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Direct storage to Supabase without going through problematic services
   */
  private async storeDirectlyToSupabase(conversations: any[]): Promise<number> {
    let storedCount = 0;

    try {
      // Import Supabase directly
      const { supabase } = await import('../lib/supabase');

      for (const conversation of conversations) {
        try {
          // Generate embedding if OpenAI key is available
          let embedding = null;
          if (OPENAI_API_KEY && OPENAI_API_KEY !== 'your-openai-api-key-here') {
            try {
              embedding = await this.generateEmbeddingDirect(this.formatConversationText(conversation));
            } catch (embError) {
              console.warn('Embedding generation failed, storing without embedding:', embError);
            }
          }

          // Prepare conversation data
          const conversationText = this.formatConversationText(conversation);
          const conversationData = {
            original_conversation: conversation,
            message_count: conversation.transcript?.messages?.length || 0,
            participants: new Set(conversation.transcript?.messages?.map((m: any) => m.role) || []).size,
            imported_at: new Date().toISOString(),
            import_method: 'direct_api'
          };

          const metadata = {
            user_id: conversation.user_id,
            session_id: conversation.id,
            agent_id: conversation.agent_id,
            created_at: conversation.created_at,
            duration_seconds: conversation.metadata?.duration_seconds,
            status: conversation.metadata?.status,
            tags: ['retirement_knowledge', 'experience_capture', 'direct_sync'],
            import_method: 'direct_bypass'
          };

          // Insert directly into Supabase
          const { data, error } = await supabase
            .from('conversations')
            .insert({
              conversation_text: conversationText,
              conversation_data: conversationData,
              embedding: embedding,
              metadata: metadata,
            })
            .select('id')
            .single();

          if (error) {
            console.error('Supabase insert error:', error);
          } else {
            storedCount++;
            console.log(`✅ Stored conversation: ${conversation.id} -> ${data.id}`);
          }

        } catch (convError) {
          console.error('Error storing individual conversation:', convError);
        }
      }

    } catch (supabaseError) {
      console.error('Supabase connection error:', supabaseError);
    }

    return storedCount;
  }

  /**
   * Direct embedding generation via proxy
   */
  private async generateEmbeddingDirect(text: string): Promise<number[] | null> {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
      return null;
    }

    try {
      const response = await fetch(`${PROXY_SERVER_URL}/api/openai/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Embedding API error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      return data.embedding;
    } catch (error) {
      console.error('Embedding generation error:', error);
      return null;
    }
  }

  /**
   * Get available agents
   */
  async getAvailableAgents(): Promise<DirectSyncResult> {
    const result: DirectSyncResult = {
      success: false,
      method: 'Get Agents',
      conversationsFound: 0,
      conversationsStored: 0,
      errors: [],
      details: {}
    };

    try {
      console.log('🔄 Fetching available agents...');

      const response = await fetch(`${PROXY_SERVER_URL}/api/elevenlabs/agents`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-cache'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`API Error: ${response.status} - ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      result.conversationsFound = data.agents?.length || 0;
      result.details.agents = data.agents || [];
      result.success = true;

      console.log(`✅ Found ${result.conversationsFound} agents`);
      if (data.agents) {
        data.agents.forEach((agent: any, index: number) => {
          console.log(`${index + 1}. ${agent.agent_id || agent.id} - ${agent.name || 'Unnamed Agent'}`);
        });
      }

    } catch (error) {
      result.errors.push(`Get Agents Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Test proxy server connectivity
   */
  async testProxyServer(): Promise<DirectSyncResult> {
    const result: DirectSyncResult = {
      success: false,
      method: 'Test Proxy',
      conversationsFound: 0,
      conversationsStored: 0,
      errors: [],
      details: {}
    };

    try {
      console.log('🔄 Testing proxy server connectivity...');

      const response = await fetch(`${PROXY_SERVER_URL}/api/test`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Proxy server not responding: ${response.status}`);
      }

      const data = await response.json();
      result.details.proxyTest = data;
      result.success = data.elevenlabs?.available || false;

      if (!result.success) {
        result.errors.push(`ElevenLabs API not available: ${data.elevenlabs?.error || 'Unknown error'}`);
      }

      console.log('✅ Proxy server test results:', data);

    } catch (error) {
      result.errors.push(`Proxy Test Error: ${error instanceof Error ? error.message : String(error)}`);
    }

    return result;
  }

  /**
   * Format conversation for storage
   */
  private formatConversationText(conversation: any): string {
    const messages = conversation.transcript?.messages || [];

    return messages
      .map((message: any) => {
        const timestamp = new Date(message.timestamp).toLocaleString();
        const speaker = message.role === 'agent' ? 'Agent' : 'User';
        return `[${timestamp}] ${speaker}: ${message.content}`;
      })
      .join('\n\n');
  }

  /**
   * Test all methods sequentially
   */
  async testAllMethods(agentId: string = 'agent_4301k60jbejbebzr750zdg463tr4'): Promise<DirectSyncResult[]> {
    console.log('🚀 Testing all bypass methods...');

    const results: DirectSyncResult[] = [];

    // Method 1: Direct Fetch
    console.log('\n--- Testing Method 1: Direct Fetch ---');
    results.push(await this.syncViaDirectFetch(agentId));

    // Method 2: XMLHttpRequest (only if Method 1 failed)
    if (!results[0].success) {
      console.log('\n--- Testing Method 2: XMLHttpRequest ---');
      results.push(await this.syncViaXMLHttpRequest(agentId));
    }

    return results;
  }

  /**
   * Get sample conversation data for testing
   */
  getSampleConversationData(): any {
    return {
      id: `test_${Date.now()}`,
      agent_id: 'agent_4301k60jbejbebzr750zdg463tr4',
      user_id: 'test_user',
      created_at: new Date().toISOString(),
      transcript: {
        messages: [
          {
            role: 'user',
            content: 'Hello, I have a question about retirement planning.',
            timestamp: new Date(Date.now() - 60000).toISOString()
          },
          {
            role: 'agent',
            content: 'I\'d be happy to help with your retirement planning questions. What specific aspects would you like to discuss?',
            timestamp: new Date().toISOString()
          }
        ]
      },
      metadata: {
        duration_seconds: 120,
        status: 'completed'
      }
    };
  }
}

// Export singleton instance
export const directApiService = new DirectApiService();