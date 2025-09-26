import { ElevenLabsService, type ConversationHistory } from './elevenlabsService';
import { ConversationStorageService } from './conversationStorageService';
import { conversationMonitor, type ConversationMonitoringSession } from './conversationMonitoringService';

export interface SyncResult {
  success: boolean;
  processed: number;
  stored: number;
  errors: Array<{
    conversationId: string;
    error: string;
  }>;
  storedIds: string[];
  sessionId: string;
  milestones?: ConversationMonitoringSession;
}

export class ConversationIntegrationService {
  private elevenLabsService: ElevenLabsService;
  private storageService: ConversationStorageService;

  constructor() {
    this.elevenLabsService = new ElevenLabsService();
    this.storageService = new ConversationStorageService();
  }

  /**
   * Sync all conversations for the configured agent with monitoring
   */
  async syncAllConversations(agentId: string = 'agent_4301k60jbejbebzr750zdg463tr4'): Promise<SyncResult> {
    const sessionId = `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const session = conversationMonitor.startSession(sessionId, agentId);

    const result: SyncResult = {
      success: false,
      processed: 0,
      stored: 0,
      errors: [],
      storedIds: [],
      sessionId,
      milestones: session,
    };

    try {
      console.log(`🚀 Starting monitored sync for agent: ${agentId}`);
      console.log(`📝 Session ID: ${sessionId}`);

      // Test API connection
      conversationMonitor.logMilestone(sessionId, 'api_connection', 'Testing ElevenLabs API connection...');
      const apiConnected = await conversationMonitor.testApiConnection(sessionId);
      if (!apiConnected) {
        throw new Error('Failed to connect to ElevenLabs API');
      }

      // Test Supabase connection
      conversationMonitor.logMilestone(sessionId, 'supabase_connection', 'Testing Supabase connection...');
      const dbConnected = await conversationMonitor.testSupabaseConnection(sessionId);
      if (!dbConnected) {
        throw new Error('Failed to connect to Supabase database');
      }

      // Fetch conversations
      conversationMonitor.updateMilestone(sessionId, 'fetch_conversations', 'in_progress');
      conversationMonitor.logMilestone(sessionId, 'fetch_conversations', `Fetching conversations for agent ${agentId}...`);

      const conversations = await this.elevenLabsService.getConversationHistory(agentId);
      result.processed = conversations.length;
      conversationMonitor.updateMilestone(sessionId, 'fetch_conversations', 'completed', {
        count: conversations.length
      });

      if (conversations.length === 0) {
        conversationMonitor.logMilestone(sessionId, 'fetch_conversations', 'No conversations found for this agent');
        result.success = true;
        conversationMonitor.completeSession(sessionId);
        return result;
      }

      // Validate conversations
      conversationMonitor.updateMilestone(sessionId, 'validate_conversations', 'in_progress');
      conversationMonitor.logMilestone(sessionId, 'validate_conversations', `Validating ${conversations.length} conversations...`);

      const validConversations = conversations.filter(conv =>
        conv.transcript && conv.transcript.messages && conv.transcript.messages.length > 0
      );

      conversationMonitor.updateMilestone(sessionId, 'validate_conversations', 'completed', {
        total: conversations.length,
        valid: validConversations.length,
        invalid: conversations.length - validConversations.length
      });

      // Check for duplicates
      conversationMonitor.updateMilestone(sessionId, 'check_duplicates', 'in_progress');
      conversationMonitor.logMilestone(sessionId, 'check_duplicates', 'Checking for existing conversations...');

      const existingConversations = await this.storageService.getConversationsByMetadata(
        { agent_id: agentId },
        1000
      );

      const existingSessionIds = new Set(
        existingConversations.map(c => c.metadata?.session_id).filter(Boolean)
      );

      // Filter out conversations that are already stored
      const newConversations = validConversations.filter(
        conv => !existingSessionIds.has(conv.id)
      );

      conversationMonitor.updateMilestone(sessionId, 'check_duplicates', 'completed', {
        existing: existingConversations.length,
        new: newConversations.length,
        duplicates: validConversations.length - newConversations.length
      });

      if (newConversations.length === 0) {
        conversationMonitor.logMilestone(sessionId, 'check_duplicates', 'All conversations are already synced');
        result.success = true;
        conversationMonitor.completeSession(sessionId);
        return result;
      }

      // Generate embeddings
      conversationMonitor.updateMilestone(sessionId, 'generate_embeddings', 'in_progress');
      conversationMonitor.logMilestone(sessionId, 'generate_embeddings', `Preparing to generate embeddings for ${newConversations.length} conversations...`);

      // Store conversations
      conversationMonitor.updateMilestone(sessionId, 'store_conversations', 'in_progress');
      conversationMonitor.logMilestone(sessionId, 'store_conversations', `Storing ${newConversations.length} conversations...`);

      // Process conversations in batches
      const batchSize = 5;
      for (let i = 0; i < newConversations.length; i += batchSize) {
        const batch = newConversations.slice(i, i + batchSize);
        const batchNum = Math.floor(i / batchSize) + 1;
        const totalBatches = Math.ceil(newConversations.length / batchSize);

        conversationMonitor.logMilestone(sessionId, 'store_conversations',
          `Processing batch ${batchNum}/${totalBatches} (${batch.length} conversations)`);

        for (const conversation of batch) {
          try {
            await this.syncSingleConversationWithMonitoring(sessionId, conversation);
            result.stored++;
            result.storedIds.push(conversation.id);
          } catch (error) {
            console.error(`❌ Error syncing conversation ${conversation.id}:`, error);
            result.errors.push({
              conversationId: conversation.id,
              error: error instanceof Error ? error.message : String(error),
            });
          }
        }

        // Add delay between batches to avoid rate limits
        if (i + batchSize < newConversations.length) {
          conversationMonitor.logMilestone(sessionId, 'store_conversations', 'Waiting before next batch...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // Complete storage milestone
      conversationMonitor.updateMilestone(sessionId, 'store_conversations', 'completed', {
        stored: result.stored,
        errors: result.errors.length
      });

      // Verify storage
      conversationMonitor.updateMilestone(sessionId, 'verify_storage', 'in_progress');
      conversationMonitor.logMilestone(sessionId, 'verify_storage', 'Verifying stored conversations...');

      try {
        const verificationCount = await this.verifyStoredConversations(sessionId, result.storedIds);
        conversationMonitor.updateMilestone(sessionId, 'verify_storage', 'completed', {
          verified: verificationCount,
          expected: result.storedIds.length
        });
      } catch (error) {
        conversationMonitor.updateMilestone(sessionId, 'verify_storage', 'error', null,
          `Verification failed: ${error instanceof Error ? error.message : String(error)}`);
      }

      result.success = result.errors.length < newConversations.length;
      conversationMonitor.completeSession(sessionId);

      return result;
    } catch (error) {
      console.error('❌ Error during conversation sync:', error);
      result.errors.push({
        conversationId: 'sync_process',
        error: error instanceof Error ? error.message : String(error),
      });
      conversationMonitor.completeSession(sessionId);
      return result;
    }
  }

  /**
   * Sync a single conversation
   */
  async syncSingleConversation(conversation: ConversationHistory): Promise<string> {
    try {
      // Format conversation text
      const conversationText = this.elevenLabsService.formatConversationText(conversation);

      // Extract conversation summary and metadata
      const summary = this.elevenLabsService.extractConversationSummary(conversation);

      // Prepare additional metadata
      const additionalMetadata = {
        summary: summary.summary,
        key_topics: summary.keyTopics,
        participant_count: summary.participantCount,
        message_count: conversation.transcript.messages?.length || 0,
        sync_date: new Date().toISOString(),
      };

      // Store in Supabase with embedding
      const storedId = await this.storageService.storeConversation(
        conversation,
        conversationText,
        additionalMetadata
      );

      console.log(`Successfully synced conversation ${conversation.id} -> ${storedId}`);
      return storedId;
    } catch (error) {
      console.error(`Error syncing conversation ${conversation.id}:`, error);
      throw error;
    }
  }

  /**
   * Search conversations using natural language
   */
  async searchConversations(query: string, limit: number = 10) {
    try {
      return await this.storageService.searchConversations(query, limit);
    } catch (error) {
      console.error('Error searching conversations:', error);
      throw error;
    }
  }

  /**
   * Get conversation statistics
   */
  async getConversationStats(agentId: string = 'agent_4301k60jbejbebzr750zdg463tr4') {
    try {
      const conversations = await this.storageService.getConversationsByMetadata(
        { agent_id: agentId },
        1000
      );

      const stats = {
        total_conversations: conversations.length,
        total_messages: conversations.reduce(
          (sum, conv) => sum + (conv.conversation_data?.message_count || 0),
          0
        ),
        date_range: {
          earliest: conversations.length > 0
            ? Math.min(...conversations.map(c => new Date(c.created_at || 0).getTime()))
            : null,
          latest: conversations.length > 0
            ? Math.max(...conversations.map(c => new Date(c.created_at || 0).getTime()))
            : null,
        },
        topics: this.extractTopTopics(conversations),
      };

      return stats;
    } catch (error) {
      console.error('Error getting conversation stats:', error);
      throw error;
    }
  }

  /**
   * Extract top topics from stored conversations
   */
  private extractTopTopics(conversations: any[]): Array<{ topic: string; count: number }> {
    const topicCounts: Record<string, number> = {};

    conversations.forEach(conv => {
      const keyTopics = conv.metadata?.key_topics || [];
      keyTopics.forEach((topic: string) => {
        topicCounts[topic] = (topicCounts[topic] || 0) + 1;
      });
    });

    return Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20)
      .map(([topic, count]) => ({ topic, count }));
  }

  /**
   * Sync a single conversation with monitoring
   */
  async syncSingleConversationWithMonitoring(sessionId: string, conversation: ConversationHistory): Promise<string> {
    try {
      // Generate embedding milestone is already in progress from parent method
      conversationMonitor.updateMilestone(sessionId, 'generate_embeddings', 'completed', {
        conversationId: conversation.id
      });

      const storedId = await this.syncSingleConversation(conversation);
      console.log(`✅ Successfully synced conversation ${conversation.id} -> ${storedId}`);
      return storedId;
    } catch (error) {
      console.error(`❌ Error syncing conversation ${conversation.id}:`, error);
      throw error;
    }
  }

  /**
   * Verify that conversations were successfully stored
   */
  async verifyStoredConversations(sessionId: string, storedIds: string[]): Promise<number> {
    let verified = 0;
    for (const id of storedIds) {
      try {
        const stored = await this.storageService.getConversationById(id);
        if (stored) {
          verified++;
        }
      } catch (error) {
        console.warn(`Could not verify conversation ${id}:`, error);
      }
    }
    return verified;
  }

  /**
   * Get monitoring session status
   */
  getMonitoringSession(sessionId: string) {
    return conversationMonitor.getSessionProgress(sessionId);
  }

  /**
   * Manual trigger to sync latest conversations with monitoring
   */
  async triggerSync(agentId?: string): Promise<SyncResult> {
    const targetAgentId = agentId || 'agent_4301k60jbejbebzr750zdg463tr4';
    console.log(`🚀 Manually triggering monitored sync for agent: ${targetAgentId}`);

    return await this.syncAllConversations(targetAgentId);
  }
}