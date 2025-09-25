import { supabase } from './supabase';
import type { ConversationRecord } from './supabase';

export interface VectorSearchResult {
  id: string;
  content: string;
  similarity: number;
  metadata: any;
  conversationData: any;
}

export class VectorSearch {
  private openaiApiKey: string;

  constructor() {
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY || '';

    if (!this.openaiApiKey) {
      console.warn('OpenAI API key not found. Vector search will be limited.');
    }
  }

  async generateEmbedding(text: string): Promise<number[] | null> {
    if (!this.openaiApiKey) {
      console.error('OpenAI API key is required for generating embeddings');
      return null;
    }

    try {
      const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          model: 'text-embedding-ada-002'
        })
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('OpenAI API error:', error);
        return null;
      }

      const data = await response.json();
      return data.data[0].embedding;
    } catch (error) {
      console.error('Error generating embedding:', error);
      return null;
    }
  }

  async saveConversationWithEmbedding(conversationText: string, conversationData: any, metadata: any = {}): Promise<string | null> {
    try {
      // Try to generate embedding, but continue without it if it fails
      let embedding = null;
      try {
        embedding = await this.generateEmbedding(conversationText);
      } catch (embeddingError) {
        console.warn('Failed to generate embedding, saving without it:', embeddingError);
      }

      const record = {
        conversation_text: conversationText,
        conversation_data: conversationData,
        metadata: metadata
      };

      // Only add embedding if we have one
      if (embedding) {
        (record as any).embedding = embedding;
      }

      const { data, error } = await supabase
        .from('conversations')
        .insert(record)
        .select('id')
        .single();

      if (error) {
        console.error('Error saving conversation:', error);
        return null;
      }

      console.log('Conversation saved successfully:', data);
      return data?.id || null;
    } catch (error) {
      console.error('Error in saveConversationWithEmbedding:', error);
      return null;
    }
  }

  async searchSimilarConversations(query: string, limit: number = 5, threshold: number = 0.8): Promise<VectorSearchResult[]> {
    try {
      // Generate embedding for the query
      const queryEmbedding = await this.generateEmbedding(query);

      if (!queryEmbedding) {
        console.warn('Could not generate embedding for query, falling back to text search');
        return await this.fallbackTextSearch(query, limit);
      }

      // Use Supabase's vector similarity search
      const { data, error } = await supabase.rpc('search_conversations', {
        query_embedding: queryEmbedding,
        similarity_threshold: threshold,
        match_count: limit
      });

      if (error) {
        console.error('Error in vector search:', error);
        return await this.fallbackTextSearch(query, limit);
      }

      return data?.map((item: any) => ({
        id: item.id,
        content: item.conversation_text,
        similarity: item.similarity,
        metadata: item.metadata,
        conversationData: item.conversation_data
      })) || [];

    } catch (error) {
      console.error('Error in searchSimilarConversations:', error);
      return await this.fallbackTextSearch(query, limit);
    }
  }

  private async fallbackTextSearch(query: string, limit: number): Promise<VectorSearchResult[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .textSearch('conversation_text', query)
        .limit(limit);

      if (error) {
        console.error('Error in text search fallback:', error);
        return [];
      }

      return data?.map((item: ConversationRecord) => ({
        id: item.id || '',
        content: item.conversation_text,
        similarity: 0.5, // Default similarity for text search
        metadata: item.metadata,
        conversationData: item.conversation_data
      })) || [];

    } catch (error) {
      console.error('Error in fallback text search:', error);
      return [];
    }
  }

  async getBestAnswer(query: string): Promise<string | null> {
    try {
      const results = await this.searchSimilarConversations(query, 3, 0.7);

      if (results.length === 0) {
        return null;
      }

      // Return the most relevant answer
      const bestResult = results[0];

      // Extract assistant response from conversation data
      if (bestResult.conversationData && Array.isArray(bestResult.conversationData)) {
        const assistantMessages = bestResult.conversationData.filter(
          (msg: any) => msg.role === 'assistant'
        );

        if (assistantMessages.length > 0) {
          return assistantMessages[assistantMessages.length - 1].content;
        }
      }

      return bestResult.content;
    } catch (error) {
      console.error('Error getting best answer:', error);
      return null;
    }
  }
}

export const vectorSearch = new VectorSearch();