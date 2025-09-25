import { supabase } from './supabase';

interface TranscriptMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ConversationMetadata {
  conversation_id: string;
  source: 'elevenlabs';
  tags?: string[];
  [key: string]: any;
}

export class ConversationCapture {
  private elevenLabsApiKey: string;
  private openaiApiKey: string;

  constructor() {
    this.elevenLabsApiKey = import.meta.env.VITE_ELEVEN_LABS_API_KEY || import.meta.env.REACT_APP_ELEVEN_LABS_API_KEY || '';
    this.openaiApiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.REACT_APP_OPENAI_API_KEY || '';

    console.log('🔧 ConversationCapture initialized');
    console.log('🔑 ElevenLabs API key:', this.elevenLabsApiKey ? '✅ Present' : '❌ Missing');
    console.log('🔑 OpenAI API key:', this.openaiApiKey ? '✅ Present' : '❌ Missing');

    this.initializeCapture();
  }

  private initializeCapture(): void {
    if (typeof window === 'undefined') {
      console.log('❌ Window not available, skipping capture initialization');
      return;
    }

    console.log('🚀 Initializing conversation capture...');
    this.injectConversationEndDetector();
  }

  private injectConversationEndDetector(): void {
    console.log('💉 Injecting conversation end detector...');

    const script = document.createElement('script');
    script.textContent = `
      (function() {
        console.log('📋 Conversation end detector script loaded');
        let lastConversationId = null;
        let conversationEndTimer = null;

        // Override console.log to detect conversation end messages
        const originalConsoleLog = console.log;
        console.log = function(...args) {
          const message = args.join(' ');

          // Log all messages for debugging
          if (message.includes('conv_') || message.includes('conversation') || message.includes('agent')) {
            console.log('🔍 DETECTED RELEVANT MESSAGE:', message);
          }

          // Detect the specific conversation end message
          if (message.includes('agent ended the conversation') && message.includes('conv_')) {
            const match = message.match(/conv_[a-zA-Z0-9]+/);
            if (match) {
              const conversationId = match[0];
              console.log('🎯 CONVERSATION END DETECTED (Console Message)!');
              console.log('🆔 Conversation ID:', conversationId);
              console.log('📨 Full message:', message);

              lastConversationId = conversationId;

              // Send message to our capture system
              window.postMessage({
                type: 'conversation-ended',
                conversationId: conversationId,
                fullMessage: message,
                trigger: 'console-message'
              }, '*');
            }
          }

          // Call original console.log
          originalConsoleLog.apply(this, args);
        };

        // Override console.error to detect WebSocket errors
        const originalConsoleError = console.error;
        console.error = function(...args) {
          const message = args.join(' ');

          console.log('🚨 CONSOLE ERROR DETECTED:', message);

          // Detect WebSocket closing/closed state errors
          if (message.includes('WebSocket is already in CLOSING or CLOSED state') ||
              message.includes('sendMessage') ||
              message.includes('convai-widget-embed')) {

            console.log('🎯 WEBSOCKET ERROR DETECTED - This likely means conversation ended!');
            console.log('📨 WebSocket error message:', message);

            // If we have a recent conversation ID, use it
            if (lastConversationId) {
              console.log('🆔 Using last known conversation ID:', lastConversationId);

              // Clear any existing timer
              if (conversationEndTimer) {
                clearTimeout(conversationEndTimer);
              }

              // Set a short delay to allow any other end messages to come through
              conversationEndTimer = setTimeout(() => {
                window.postMessage({
                  type: 'conversation-ended',
                  conversationId: lastConversationId,
                  fullMessage: 'WebSocket error detected: ' + message,
                  trigger: 'websocket-error'
                }, '*');
              }, 2000); // 2 second delay
            } else {
              console.log('⚠️ WebSocket error detected but no conversation ID available');
            }
          }

          // Call original console.error
          originalConsoleError.apply(this, args);
        };

        // Also capture any conversation IDs we see in regular messages
        const originalConsoleWarn = console.warn;
        console.warn = function(...args) {
          const message = args.join(' ');

          // Log and capture any conversation IDs
          if (message.includes('conv_')) {
            const match = message.match(/conv_[a-zA-Z0-9]+/);
            if (match) {
              console.log('🆔 CONVERSATION ID FOUND IN WARNING:', match[0]);
              lastConversationId = match[0];
            }
          }

          originalConsoleWarn.apply(this, args);
        };

        console.log('✅ Console overrides installed successfully');
      })();
    `;

    document.head.appendChild(script);
    console.log('✅ Conversation end detector injected');

    // Set up message listener
    this.setupMessageListener();
  }

  private setupMessageListener(): void {
    console.log('👂 Setting up message listener...');

    window.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'conversation-ended') {
        console.log('📬 Received conversation end message:', event.data);
        console.log('🔥 Trigger type:', event.data.trigger || 'unknown');
        console.log('📨 Full message:', event.data.fullMessage);

        this.handleConversationEnd(event.data.conversationId, event.data.trigger);
      }
    });

    console.log('✅ Message listener set up');
  }

  private async handleConversationEnd(conversationId: string, trigger?: string): Promise<void> {
    console.log('');
    console.log('🏁 ============================================');
    console.log('🏁 PROCESSING CONVERSATION END');
    console.log('🏁 ============================================');
    console.log('🆔 Conversation ID:', conversationId);
    console.log('🔥 Triggered by:', trigger || 'unknown');

    try {
      console.log('📝 Step 1: Fetching transcript from ElevenLabs...');
      const transcript = await this.fetchTranscriptFromElevenLabs(conversationId);

      if (!transcript || transcript.length === 0) {
        console.log('❌ No transcript received, aborting');
        return;
      }

      console.log('📝 Step 2: Generating embedding...');
      const conversationText = this.formatTranscriptForEmbedding(transcript);
      const embedding = await this.generateEmbedding(conversationText);

      console.log('📝 Step 3: Saving to Supabase...');
      await this.saveToSupabase(conversationId, conversationText, transcript, embedding);

      console.log('');
      console.log('✅ ============================================');
      console.log('✅ CONVERSATION SUCCESSFULLY PROCESSED!');
      console.log('✅ ============================================');
      console.log('');

    } catch (error) {
      console.log('');
      console.log('❌ ============================================');
      console.log('❌ ERROR PROCESSING CONVERSATION');
      console.log('❌ ============================================');
      console.error('❌ Error details:', error);
      console.log('');
    }
  }

  private async fetchTranscriptFromElevenLabs(conversationId: string): Promise<TranscriptMessage[] | null> {
    console.log('🌐 Fetching transcript from ElevenLabs API...');
    console.log('🆔 Conversation ID:', conversationId);

    if (!this.elevenLabsApiKey) {
      console.log('❌ ElevenLabs API key missing, cannot fetch transcript');
      return null;
    }

    try {
      // Try the most common ElevenLabs conversation API endpoint
      const url = `https://api.elevenlabs.io/v1/convai/conversations/${conversationId}`;
      console.log('🔗 API URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'xi-api-key': this.elevenLabsApiKey,
          'Content-Type': 'application/json'
        }
      });

      console.log('📡 API Response status:', response.status);
      console.log('📡 API Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ API Error response:', errorText);
        throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📥 Raw API response:', data);

      // Try to extract transcript from response
      let transcript: TranscriptMessage[] = [];

      // Check different possible response structures
      if (data.transcript) {
        console.log('📋 Found transcript in data.transcript');
        transcript = this.parseTranscript(data.transcript);
      } else if (data.messages) {
        console.log('📋 Found messages in data.messages');
        transcript = this.parseTranscript(data.messages);
      } else if (data.conversation) {
        console.log('📋 Found conversation in data.conversation');
        transcript = this.parseTranscript(data.conversation);
      } else if (Array.isArray(data)) {
        console.log('📋 Response is array, treating as transcript');
        transcript = this.parseTranscript(data);
      } else {
        console.log('⚠️ Unknown response structure, trying to parse entire response');
        transcript = this.parseTranscript(data);
      }

      console.log('📊 Parsed transcript length:', transcript.length);
      console.log('📋 Parsed transcript:', transcript);

      return transcript;

    } catch (error) {
      console.error('❌ Error fetching transcript:', error);
      throw error;
    }
  }

  private parseTranscript(data: any): TranscriptMessage[] {
    console.log('🔍 Parsing transcript data:', data);

    const messages: TranscriptMessage[] = [];

    if (Array.isArray(data)) {
      console.log('📝 Data is array, processing each item');

      data.forEach((item, index) => {
        console.log(`📝 Processing item ${index}:`, item);

        if (typeof item === 'string') {
          // Simple string message
          messages.push({
            role: index % 2 === 0 ? 'user' : 'assistant',
            content: item,
            timestamp: new Date().toISOString()
          });
        } else if (item.role && item.content) {
          // Structured message
          messages.push({
            role: item.role === 'user' ? 'user' : 'assistant',
            content: item.content,
            timestamp: item.timestamp || new Date().toISOString()
          });
        } else if (item.message || item.text) {
          // Message with different property names
          messages.push({
            role: item.speaker === 'user' || item.type === 'user' ? 'user' : 'assistant',
            content: item.message || item.text,
            timestamp: item.timestamp || new Date().toISOString()
          });
        }
      });
    } else if (typeof data === 'string') {
      console.log('📝 Data is string, treating as single message');
      messages.push({
        role: 'assistant',
        content: data,
        timestamp: new Date().toISOString()
      });
    } else {
      console.log('📝 Data is object, extracting text content');
      const content = data.content || data.message || data.text || JSON.stringify(data);
      messages.push({
        role: 'assistant',
        content: content,
        timestamp: new Date().toISOString()
      });
    }

    console.log('✅ Parsed messages:', messages);
    return messages;
  }

  private formatTranscriptForEmbedding(transcript: TranscriptMessage[]): string {
    console.log('📝 Formatting transcript for embedding...');

    const formatted = transcript
      .map(msg => `${msg.role}: ${msg.content}`)
      .join('\n');

    console.log('📝 Formatted text length:', formatted.length);
    console.log('📝 Formatted text preview:', formatted.substring(0, 200) + '...');

    return formatted;
  }

  private async generateEmbedding(text: string): Promise<number[] | null> {
    console.log('🧠 Generating embedding...');
    console.log('📝 Text length:', text.length);

    if (!this.openaiApiKey) {
      console.log('⚠️ OpenAI API key missing, saving without embedding');
      return null;
    }

    try {
      console.log('🔗 Calling OpenAI embeddings API...');

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

      console.log('🤖 OpenAI API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ OpenAI API error:', errorText);
        throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('🧠 Embedding generated successfully');
      console.log('📊 Embedding dimensions:', data.data[0].embedding.length);

      return data.data[0].embedding;

    } catch (error) {
      console.error('❌ Error generating embedding:', error);
      return null;
    }
  }

  private async saveToSupabase(
    conversationId: string,
    conversationText: string,
    transcript: TranscriptMessage[],
    embedding: number[] | null
  ): Promise<void> {
    console.log('💾 Saving to Supabase...');
    console.log('🆔 Conversation ID:', conversationId);
    console.log('📝 Text length:', conversationText.length);
    console.log('📨 Message count:', transcript.length);
    console.log('🧠 Has embedding:', !!embedding);

    try {
      const metadata: ConversationMetadata = {
        conversation_id: conversationId,
        source: 'elevenlabs',
        tags: this.extractTags(conversationText)
      };

      const record = {
        conversation_text: conversationText,
        conversation_data: transcript,
        embedding: embedding,
        metadata: metadata
      };

      console.log('📄 Record to insert:', {
        conversation_text_length: record.conversation_text.length,
        conversation_data_length: record.conversation_data.length,
        has_embedding: !!record.embedding,
        metadata: record.metadata
      });

      console.log('🔗 Inserting into Supabase conversations table...');

      const { data, error } = await supabase
        .from('conversations')
        .insert(record)
        .select('id')
        .single();

      if (error) {
        console.log('❌ Supabase error:', error);
        console.log('❌ Error code:', error.code);
        console.log('❌ Error message:', error.message);
        console.log('❌ Error details:', error.details);
        throw error;
      }

      console.log('✅ Successfully saved to Supabase!');
      console.log('🆔 Record ID:', data.id);

      // Verify the save worked
      console.log('🔍 Verifying save...');
      const { data: verifyData, error: verifyError } = await supabase
        .from('conversations')
        .select('id, conversation_text, metadata')
        .eq('id', data.id)
        .single();

      if (verifyError) {
        console.log('⚠️ Verification failed:', verifyError);
      } else {
        console.log('✅ Verification successful:', verifyData);
      }

    } catch (error) {
      console.error('❌ Error saving to Supabase:', error);
      throw error;
    }
  }

  private extractTags(text: string): string[] {
    console.log('🏷️ Extracting tags...');

    const commonTopics = [
      'support', 'question', 'help', 'issue', 'problem', 'information',
      'product', 'service', 'order', 'payment', 'account', 'technical',
      'feedback', 'complaint', 'suggestion', 'inquiry'
    ];

    const textLower = text.toLowerCase();
    const foundTags = commonTopics.filter(topic => textLower.includes(topic));

    console.log('🏷️ Extracted tags:', foundTags);
    return foundTags.slice(0, 5);
  }

  // Public method to check status
  public getStatus(): { initialized: boolean; hasElevenLabsKey: boolean; hasOpenAIKey: boolean } {
    const status = {
      initialized: typeof window !== 'undefined',
      hasElevenLabsKey: !!this.elevenLabsApiKey,
      hasOpenAIKey: !!this.openaiApiKey
    };

    console.log('📊 ConversationCapture status:', status);
    return status;
  }

  // Manual method to test transcript fetching
  public async testTranscriptFetch(conversationId: string): Promise<void> {
    console.log('🧪 Testing transcript fetch for conversation:', conversationId);
    await this.handleConversationEnd(conversationId);
  }
}

// Create singleton instance
export const conversationCapture = new ConversationCapture();