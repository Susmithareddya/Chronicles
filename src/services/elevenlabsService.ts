const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
const PROXY_BASE_URL = import.meta.env.VITE_PROXY_URL || 'http://localhost:3001';
const USE_PROXY = import.meta.env.VITE_USE_PROXY !== 'false'; // Default to true

// Determine API base URL - use Vercel API routes in production, proxy in development
const getApiBaseUrl = () => {
  // If custom API base URL is set, use it
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }

  // In production (Vercel), use relative API routes
  if (import.meta.env.PROD) {
    return '/api/elevenlabs';
  }

  // In development, use proxy or direct API
  return USE_PROXY ? `${PROXY_BASE_URL}/api/elevenlabs` : 'https://api.elevenlabs.io/v1';
};

const API_BASE_URL = getApiBaseUrl();

export interface ConversationHistory {
  conversation_id: string;
  agent_id: string;
  user_id?: string;
  status: string;
  transcript: Array<{
    role: 'user' | 'agent';
    message: string | null;
    time_in_call_secs: number;
    [key: string]: any;
  }>;
  metadata: {
    start_time_unix_secs: number;
    call_duration_secs: number;
    [key: string]: any;
  };
  analysis?: {
    transcript_summary?: string;
    call_summary_title?: string;
    [key: string]: any;
  };
}

export class ElevenLabsService {
  private apiKey: string;
  private baseUrl: string;
  private useProxy: boolean;

  constructor() {
    this.apiKey = ELEVENLABS_API_KEY;
    this.baseUrl = API_BASE_URL;
    this.useProxy = USE_PROXY;
  }

  /**
   * Fetch conversation history for a specific agent using the correct ElevenLabs API
   */
  async getConversationHistory(agentId: string, pageSize: number = 30): Promise<ConversationHistory[]> {
    try {
      // In development with proxy or production with Vercel API routes, use simplified endpoint
      const isUsingApiRoutes = this.baseUrl.includes('/api/elevenlabs') || import.meta.env.PROD;

      const url = isUsingApiRoutes
        ? `${this.baseUrl}/conversations`
        : `${this.baseUrl}/convai/conversations`;

      const params = new URLSearchParams({
        agent_id: agentId,
        page_size: pageSize.toString(),
      });

      const fullUrl = `${url}?${params}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Only add auth header if calling ElevenLabs directly (not through proxy/API routes)
      if (!isUsingApiRoutes && this.apiKey) {
        headers['xi-api-key'] = this.apiKey;
      }

      console.log(`🔄 Fetching conversations from: ${fullUrl}`);
      console.log(`📡 Using proxy: ${this.useProxy}`);

      const response = await fetch(fullUrl, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ API error: ${response.status} - ${errorText}`);
        throw new Error(`ElevenLabs API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      const conversations = data.conversations || [];
      console.log(`✅ Found ${conversations?.length || 0} conversations for agent ${agentId}`);

      return conversations;
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }

  /**
   * Get latest conversations for an agent
   */
  async getLatestConversations(agentId: string, limit: number = 10): Promise<ConversationHistory[]> {
    console.log(`🔍 Fetching latest ${limit} conversations for agent: ${agentId}`);

    // Get the conversation list (which returns conversation summaries)
    const conversations = await this.getConversationHistory(agentId, limit);

    if (conversations.length === 0) {
      return [];
    }

    // Get full conversation details for each conversation
    const fullConversations = await Promise.all(
      conversations.map(async (conv: any) => {
        try {
          return await this.getConversation(conv.conversation_id);
        } catch (error) {
          console.warn(`Failed to fetch conversation ${conv.conversation_id}:`, error);
          return null;
        }
      })
    );

    return fullConversations.filter(conv => conv !== null) as ConversationHistory[];
  }

  /**
   * Get the single most recent conversation for an agent
   */
  async getLatestConversation(agentId: string): Promise<ConversationHistory | null> {
    console.log(`🔍 Fetching latest conversation for agent: ${agentId}`);

    const conversations = await this.getLatestConversations(agentId, 1);
    return conversations.length > 0 ? conversations[0] : null;
  }

  /**
   * Fetch a specific conversation by ID
   */
  async getConversation(conversationId: string): Promise<ConversationHistory | null> {
    try {
      // In development with proxy or production with Vercel API routes, use simplified endpoint
      const isUsingApiRoutes = this.baseUrl.includes('/api/elevenlabs') || import.meta.env.PROD;

      const url = isUsingApiRoutes
        ? `${this.baseUrl}/conversations/${conversationId}`
        : `${this.baseUrl}/convai/conversations/${conversationId}`;

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      // Only add auth header if calling ElevenLabs directly (not through proxy/API routes)
      if (!isUsingApiRoutes && this.apiKey) {
        headers['xi-api-key'] = this.apiKey;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`ElevenLabs API error: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }

  /**
   * Convert conversation history to readable text format
   */
  formatConversationText(conversation: ConversationHistory): string {
    const transcript = conversation.transcript || [];

    return transcript
      .filter(entry => entry.message) // Only include entries with actual messages
      .map(entry => {
        const timestamp = `${Math.floor(entry.time_in_call_secs)}s`;
        const speaker = entry.role === 'agent' ? 'Agent' : 'User';
        return `[${timestamp}] ${speaker}: ${entry.message}`;
      })
      .join('\n\n');
  }

  /**
   * Extract conversation summary and key information
   */
  extractConversationSummary(conversation: ConversationHistory): {
    summary: string;
    keyTopics: string[];
    participantCount: number;
    duration: number;
  } {
    const transcript = conversation.transcript || [];
    const messageTexts = transcript
      .filter(entry => entry.message)
      .map(entry => entry.message)
      .join(' ');

    // Simple keyword extraction (you might want to use a more sophisticated NLP approach)
    const words = messageTexts.toLowerCase().split(/\W+/);
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would', 'could', 'should', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those']);
    const keyWords = words
      .filter(word => word.length > 3 && !commonWords.has(word))
      .reduce((acc, word) => {
        acc[word] = (acc[word] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const keyTopics = Object.entries(keyWords)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([word]) => word);

    return {
      summary: conversation.analysis?.transcript_summary || messageTexts.substring(0, 500) + (messageTexts.length > 500 ? '...' : ''),
      keyTopics,
      participantCount: new Set(transcript.map(entry => entry.role)).size,
      duration: conversation.metadata?.call_duration_secs || 0,
    };
  }
}