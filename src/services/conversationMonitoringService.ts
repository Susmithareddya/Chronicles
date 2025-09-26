export interface ConversationMilestone {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
  timestamp?: string;
  details?: any;
  error?: string;
}

export interface ConversationMonitoringSession {
  sessionId: string;
  agentId: string;
  startTime: string;
  milestones: ConversationMilestone[];
  currentStep: number;
  totalSteps: number;
}

export class ConversationMonitoringService {
  private sessions: Map<string, ConversationMonitoringSession> = new Map();

  /**
   * Create monitoring milestones for a conversation sync process
   */
  createSyncMilestones(sessionId: string, agentId: string): ConversationMilestone[] {
    return [
      {
        id: 'api_connection',
        name: 'ElevenLabs API Connection',
        status: 'pending',
      },
      {
        id: 'fetch_conversations',
        name: 'Fetch Conversation History',
        status: 'pending',
      },
      {
        id: 'validate_conversations',
        name: 'Validate Conversation Data',
        status: 'pending',
      },
      {
        id: 'check_duplicates',
        name: 'Check for Existing Conversations',
        status: 'pending',
      },
      {
        id: 'generate_embeddings',
        name: 'Generate Vector Embeddings',
        status: 'pending',
      },
      {
        id: 'supabase_connection',
        name: 'Supabase Database Connection',
        status: 'pending',
      },
      {
        id: 'store_conversations',
        name: 'Store Conversations in Vector DB',
        status: 'pending',
      },
      {
        id: 'verify_storage',
        name: 'Verify Successful Storage',
        status: 'pending',
      },
    ];
  }

  /**
   * Start a new monitoring session
   */
  startSession(sessionId: string, agentId: string): ConversationMonitoringSession {
    const milestones = this.createSyncMilestones(sessionId, agentId);

    const session: ConversationMonitoringSession = {
      sessionId,
      agentId,
      startTime: new Date().toISOString(),
      milestones,
      currentStep: 0,
      totalSteps: milestones.length,
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Update milestone status
   */
  updateMilestone(
    sessionId: string,
    milestoneId: string,
    status: ConversationMilestone['status'],
    details?: any,
    error?: string
  ): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const milestone = session.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    milestone.status = status;
    milestone.timestamp = new Date().toISOString();
    if (details) milestone.details = details;
    if (error) milestone.error = error;

    // Update current step
    if (status === 'in_progress') {
      session.currentStep = session.milestones.findIndex(m => m.id === milestoneId) + 1;
    }

    console.log(`📊 Milestone [${milestoneId}]: ${status.toUpperCase()}`, details ? details : '');
  }

  /**
   * Get session progress
   */
  getSessionProgress(sessionId: string): {
    progress: number;
    current: string;
    completed: number;
    failed: number;
    milestones: ConversationMilestone[];
  } | null {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    const completed = session.milestones.filter(m => m.status === 'completed').length;
    const failed = session.milestones.filter(m => m.status === 'error').length;
    const progress = Math.round((completed / session.totalSteps) * 100);
    const currentMilestone = session.milestones.find(m => m.status === 'in_progress');

    return {
      progress,
      current: currentMilestone?.name || 'Waiting...',
      completed,
      failed,
      milestones: session.milestones,
    };
  }

  /**
   * Log milestone with formatted output
   */
  logMilestone(sessionId: string, milestoneId: string, message?: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const milestone = session.milestones.find(m => m.id === milestoneId);
    if (!milestone) return;

    const progress = this.getSessionProgress(sessionId);
    if (!progress) return;

    console.log(`\n🔄 [${progress.completed}/${session.totalSteps}] ${milestone.name}`);
    if (message) console.log(`   ${message}`);
  }

  /**
   * Complete session and show summary
   */
  completeSession(sessionId: string): void {
    const session = this.sessions.get(sessionId);
    if (!session) return;

    const progress = this.getSessionProgress(sessionId);
    if (!progress) return;

    const duration = Date.now() - new Date(session.startTime).getTime();
    const durationSeconds = Math.round(duration / 1000);

    console.log(`\n✅ Session Complete: ${sessionId}`);
    console.log(`📊 Summary: ${progress.completed}/${session.totalSteps} completed, ${progress.failed} failed`);
    console.log(`⏱️  Duration: ${durationSeconds}s`);

    if (progress.failed > 0) {
      console.log(`\n❌ Failed milestones:`);
      session.milestones
        .filter(m => m.status === 'error')
        .forEach(m => {
          console.log(`   - ${m.name}: ${m.error || 'Unknown error'}`);
        });
    }
  }

  /**
   * Get all active sessions
   */
  getActiveSessions(): ConversationMonitoringSession[] {
    return Array.from(this.sessions.values());
  }

  /**
   * Clear completed sessions
   */
  clearSession(sessionId: string): void {
    this.sessions.delete(sessionId);
  }

  /**
   * Enhanced API connection test with monitoring
   */
  async testApiConnection(sessionId: string): Promise<boolean> {
    this.updateMilestone(sessionId, 'api_connection', 'in_progress');

    try {
      const response = await fetch('https://api.elevenlabs.io/v1/user', {
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_ELEVEN_LABS_API_KEY}`,
        },
      });

      if (response.ok) {
        this.updateMilestone(sessionId, 'api_connection', 'completed', {
          status: 'Connected to ElevenLabs API'
        });
        return true;
      } else {
        this.updateMilestone(sessionId, 'api_connection', 'error', null,
          `API connection failed: ${response.status}`);
        return false;
      }
    } catch (error) {
      this.updateMilestone(sessionId, 'api_connection', 'error', null,
        `API connection error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }

  /**
   * Test Supabase connection with monitoring
   */
  async testSupabaseConnection(sessionId: string): Promise<boolean> {
    this.updateMilestone(sessionId, 'supabase_connection', 'in_progress');

    try {
      const { supabase } = await import('../lib/supabase');
      const { data, error } = await supabase
        .from('conversations')
        .select('count', { count: 'exact', head: true });

      if (!error) {
        this.updateMilestone(sessionId, 'supabase_connection', 'completed', {
          status: 'Connected to Supabase',
          totalRecords: data?.length || 0
        });
        return true;
      } else {
        this.updateMilestone(sessionId, 'supabase_connection', 'error', null,
          `Supabase connection failed: ${error.message}`);
        return false;
      }
    } catch (error) {
      this.updateMilestone(sessionId, 'supabase_connection', 'error', null,
        `Supabase connection error: ${error instanceof Error ? error.message : String(error)}`);
      return false;
    }
  }
}

// Global monitoring instance
export const conversationMonitor = new ConversationMonitoringService();