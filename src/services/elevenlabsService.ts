const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
const ELEVENLABS_API_BASE_URL = 'https://api.elevenlabs.io/v1';

if (!ELEVENLABS_API_KEY) {
  throw new Error('Missing ElevenLabs API key');
}

export interface ConversationHistory {
  id: string;
  agent_id: string;
  user_id: string;
  created_at: string;
  transcript: {
    messages: Array<{
      role: 'user' | 'agent';
      content: string;
      timestamp: string;
    }>;
  };
  metadata?: {
    duration_seconds?: number;
    status?: string;
    [key: string]: any;
  };
}

export class ElevenLabsService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = ELEVENLABS_API_KEY;
    this.baseUrl = ELEVENLABS_API_BASE_URL;
  }

  /**
   * Fetch conversation history for a specific agent
   */
  async getConversationHistory(agentId: string): Promise<ConversationHistory[]> {
    try {
      const response = await fetch(`${this.baseUrl}/convai/agents/${agentId}/conversations`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`ElevenLabs API error: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      return data.conversations || [];
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }

  /**
   * Fetch a specific conversation by ID
   */
  async getConversation(conversationId: string): Promise<ConversationHistory | null> {
    try {
      const response = await fetch(`${this.baseUrl}/convai/conversations/${conversationId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
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
    const messages = conversation.transcript.messages || [];

    return messages
      .map(message => {
        const timestamp = new Date(message.timestamp).toLocaleString();
        const speaker = message.role === 'agent' ? 'Agent' : 'User';
        return `[${timestamp}] ${speaker}: ${message.content}`;
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
    const messages = conversation.transcript.messages || [];
    const messageTexts = messages.map(m => m.content).join(' ');

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
      summary: messageTexts.substring(0, 500) + (messageTexts.length > 500 ? '...' : ''),
      keyTopics,
      participantCount: new Set(messages.map(m => m.role)).size,
      duration: conversation.metadata?.duration_seconds || 0,
    };
  }
}