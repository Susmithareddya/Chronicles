import { supabase, type ConversationRow } from '../lib/supabase';
import { EmbeddingService } from './embeddingService';
import type { ConversationHistory } from './elevenlabsService';

export interface StoredConversation extends ConversationRow {
  similarity_score?: number;
}

export class ConversationStorageService {
  private embeddingService: EmbeddingService;

  constructor() {
    this.embeddingService = new EmbeddingService();
  }

  /**
   * Store a conversation in Supabase with vector embedding
   */
  async storeConversation(
    conversationHistory: ConversationHistory,
    conversationText: string,
    additionalMetadata: Record<string, any> = {}
  ): Promise<string> {
    try {
      // Prepare metadata
      const metadata = {
        user_id: conversationHistory.user_id,
        session_id: conversationHistory.id,
        agent_id: conversationHistory.agent_id,
        created_at: conversationHistory.created_at,
        duration_seconds: conversationHistory.metadata?.duration_seconds,
        status: conversationHistory.metadata?.status,
        tags: ['retirement_knowledge', 'experience_capture'],
        ...additionalMetadata,
      };

      // Generate embedding for the conversation (optional)
      const embeddingText = this.embeddingService.prepareTextForEmbedding(conversationText, metadata);
      let embedding: number[] | null = null;

      try {
        embedding = await this.embeddingService.generateEmbedding(embeddingText);
        if (embedding) {
          console.log(`✅ Generated embedding for conversation ${conversationHistory.id}`);
        } else {
          console.warn(`⚠️  No embedding generated for conversation ${conversationHistory.id} (OpenAI API key not configured)`);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to generate embedding for conversation ${conversationHistory.id}:`, error);
        // Continue without embedding - conversation will still be stored
      }

      // Prepare conversation data
      const conversationData = {
        original_conversation: conversationHistory,
        message_count: conversationHistory.transcript.messages?.length || 0,
        participants: new Set(conversationHistory.transcript.messages?.map(m => m.role) || []).size,
        imported_at: new Date().toISOString(),
      };

      // Insert into Supabase
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
        throw new Error(`Supabase error: ${error.message}`);
      }

      console.log(`Successfully stored conversation with ID: ${data.id}`);
      return data.id;
    } catch (error) {
      console.error('Error storing conversation:', error);
      throw error;
    }
  }

  /**
   * Store multiple conversations in batch
   */
  async storeConversationsBatch(
    conversations: Array<{
      history: ConversationHistory;
      text: string;
      metadata?: Record<string, any>;
    }>
  ): Promise<string[]> {
    const results: string[] = [];
    const errors: Array<{ index: number; error: any }> = [];

    for (let i = 0; i < conversations.length; i++) {
      try {
        const { history, text, metadata = {} } = conversations[i];
        const id = await this.storeConversation(history, text, metadata);
        results.push(id);

        // Add delay between insertions to avoid rate limits
        if (i < conversations.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`Error storing conversation ${i}:`, error);
        errors.push({ index: i, error });
        results.push(''); // Placeholder for failed insertion
      }
    }

    if (errors.length > 0) {
      console.warn(`Failed to store ${errors.length} out of ${conversations.length} conversations`);
    }

    return results;
  }

  /**
   * Search conversations by text similarity
   */
  async searchConversations(
    query: string,
    limit: number = 10,
    threshold: number = 0.7
  ): Promise<StoredConversation[]> {
    try {
      // Generate embedding for the search query
      const queryEmbedding = await this.embeddingService.generateEmbedding(query);

      if (!queryEmbedding) {
        // Fallback to text search if embeddings are not available
        return this.searchConversationsByText(query, limit);
      }

      // Use Supabase's vector similarity search
      const { data, error } = await supabase.rpc('match_conversations', {
        query_embedding: queryEmbedding,
        match_threshold: threshold,
        match_count: limit,
      });

      if (error) {
        console.error('Vector search error:', error);
        // Fallback to text search
        return this.searchConversationsByText(query, limit);
      }

      return data || [];
    } catch (error) {
      console.error('Error searching conversations:', error);
      return this.searchConversationsByText(query, limit);
    }
  }

  /**
   * Fallback text-based search
   */
  async searchConversationsByText(query: string, limit: number = 10): Promise<StoredConversation[]> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .textSearch('conversation_text', query)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(`Supabase search error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error in text search:', error);
      throw error;
    }
  }

  /**
   * Get conversations by metadata filters
   */
  async getConversationsByMetadata(
    filters: {
      user_id?: string;
      session_id?: string;
      agent_id?: string;
      tags?: string[];
    },
    limit: number = 50
  ): Promise<StoredConversation[]> {
    try {
      let query = supabase
        .from('conversations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filters.user_id) {
        query = query.eq('metadata->>user_id', filters.user_id);
      }

      if (filters.session_id) {
        query = query.eq('metadata->>session_id', filters.session_id);
      }

      if (filters.agent_id) {
        query = query.eq('metadata->>agent_id', filters.agent_id);
      }

      if (filters.tags && filters.tags.length > 0) {
        query = query.contains('metadata->tags', filters.tags);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Supabase query error: ${error.message}`);
      }

      return data || [];
    } catch (error) {
      console.error('Error querying conversations by metadata:', error);
      throw error;
    }
  }

  /**
   * Get conversation by ID
   */
  async getConversationById(id: string): Promise<StoredConversation | null> {
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw new Error(`Supabase error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error getting conversation by ID:', error);
      throw error;
    }
  }

  /**
   * Update conversation metadata
   */
  async updateConversationMetadata(id: string, metadata: Record<string, any>): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversations')
        .update({ metadata })
        .eq('id', id);

      if (error) {
        throw new Error(`Supabase update error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error updating conversation metadata:', error);
      throw error;
    }
  }

  /**
   * Delete conversation by ID
   */
  async deleteConversation(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(`Supabase delete error: ${error.message}`);
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
}