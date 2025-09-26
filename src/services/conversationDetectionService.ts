import { ElevenLabsService } from './elevenlabsService';

export interface ConversationEventData {
  conversationId: string;
  agentId: string;
  status: 'started' | 'ended';
  timestamp: number;
}

export class ConversationDetectionService {
  private elevenLabsService: ElevenLabsService;
  private eventListeners: ((data: ConversationEventData) => void)[] = [];
  private currentConversationId: string | null = null;
  private pollInterval: NodeJS.Timeout | null = null;
  private lastConversationCheck = 0;

  constructor() {
    this.elevenLabsService = new ElevenLabsService();
    this.initializeWidgetEventListeners();
  }

  /**
   * Initialize event listeners for ElevenLabs widget
   */
  private initializeWidgetEventListeners() {
    // Listen for ElevenLabs widget events
    window.addEventListener('message', (event) => {
      // ElevenLabs widget sends postMessage events
      if (event.origin !== window.location.origin && !event.origin.includes('elevenlabs.io')) {
        return;
      }

      const data = event.data;

      if (data.type === 'elevenlabs-conversation-started') {
        this.handleConversationStart(data.conversationId, data.agentId);
      } else if (data.type === 'elevenlabs-conversation-ended') {
        this.handleConversationEnd(data.conversationId, data.agentId);
      }
    });

    // Also check for ElevenLabs widget global events
    if (typeof window !== 'undefined') {
      // @ts-ignore - ElevenLabs global event listener
      window.elevenLabsEventHandler = (event: string, data: any) => {
        console.log('ElevenLabs event:', event, data);

        if (event === 'conversation_started') {
          this.handleConversationStart(data.conversation_id, data.agent_id);
        } else if (event === 'conversation_ended') {
          this.handleConversationEnd(data.conversation_id, data.agent_id);
        }
      };
    }

    // Start polling as fallback (check for new conversations every 5 seconds for faster detection)
    this.startPolling();
  }

  /**
   * Start polling for new conversations as fallback detection
   */
  private startPolling() {
    const agentId = 'agent_4301k60jbejbebzr750zdg463tr4'; // Your agent ID

    console.log('🔄 Starting conversation polling every 5 seconds...');

    this.pollInterval = setInterval(async () => {
      console.log('📡 Polling for new conversations...');
      try {
        const conversations = await this.elevenLabsService.getConversationHistory(agentId, 1);

        console.log(`📊 Found ${conversations.length} conversations`);

        if (conversations.length > 0) {
          const latestConversation = conversations[0];
          const conversationTime = latestConversation.metadata?.start_time_unix_secs || 0;
          console.log(`🕒 Latest conversation: ${latestConversation.conversation_id} at ${conversationTime}, last check: ${this.lastConversationCheck}`);

          // Check if this is a new conversation since last check
          if (conversationTime > this.lastConversationCheck) {
            console.log('🔍 Detected new conversation via polling:', latestConversation.conversation_id);

            // Get full conversation details immediately
            const fullConversation = await this.elevenLabsService.getConversation(latestConversation.conversation_id);

            if (fullConversation) {
              console.log('📊 Conversation status:', fullConversation.status);

              // If conversation is done, trigger the popup immediately
              if (fullConversation.status === 'done') {
                console.log('✅ Conversation completed, showing popup!');
                this.notifyConversationEnd({
                  conversationId: fullConversation.conversation_id,
                  agentId: fullConversation.agent_id,
                  status: 'ended',
                  timestamp: Date.now()
                });
              }
            }

            this.lastConversationCheck = conversationTime;
          }
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 5000); // Check every 5 seconds for faster detection
  }

  /**
   * Handle conversation start event
   */
  private handleConversationStart(conversationId: string, agentId: string) {
    console.log('🚀 Conversation started:', conversationId);
    this.currentConversationId = conversationId;

    this.notifyConversationStart({
      conversationId,
      agentId,
      status: 'started',
      timestamp: Date.now()
    });
  }

  /**
   * Handle conversation end event
   */
  private handleConversationEnd(conversationId: string, agentId: string) {
    console.log('🏁 Conversation ended:', conversationId);

    this.notifyConversationEnd({
      conversationId,
      agentId,
      status: 'ended',
      timestamp: Date.now()
    });

    this.currentConversationId = null;
  }

  /**
   * Notify listeners of conversation start
   */
  private notifyConversationStart(data: ConversationEventData) {
    this.eventListeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in conversation start listener:', error);
      }
    });
  }

  /**
   * Notify listeners of conversation end
   */
  private notifyConversationEnd(data: ConversationEventData) {
    this.eventListeners.forEach(listener => {
      try {
        listener(data);
      } catch (error) {
        console.error('Error in conversation end listener:', error);
      }
    });
  }

  /**
   * Add event listener for conversation events
   */
  public addEventListener(callback: (data: ConversationEventData) => void) {
    this.eventListeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.eventListeners.indexOf(callback);
      if (index > -1) {
        this.eventListeners.splice(index, 1);
      }
    };
  }

  /**
   * Get current conversation ID
   */
  public getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }

  /**
   * Manual trigger for testing
   */
  public async triggerTestConversationEnd(conversationId: string) {
    console.log('🧪 Triggering test conversation end:', conversationId);

    try {
      const conversation = await this.elevenLabsService.getConversation(conversationId);
      if (conversation) {
        this.handleConversationEnd(conversation.conversation_id, conversation.agent_id);
      }
    } catch (error) {
      console.error('Error triggering test conversation:', error);
    }
  }

  /**
   * Cleanup polling and event listeners
   */
  public destroy() {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }

    this.eventListeners = [];

    // @ts-ignore
    if (window.elevenLabsEventHandler) {
      // @ts-ignore
      delete window.elevenLabsEventHandler;
    }
  }
}