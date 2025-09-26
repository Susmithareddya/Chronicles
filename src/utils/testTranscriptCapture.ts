import { ElevenLabsService } from '../services/elevenlabsService';
import { ConversationIntegrationService } from '../services/conversationIntegrationService';

/**
 * Test script to verify ElevenLabs conversation transcript capture
 * This will test your enhanced agent access
 */

const AGENT_ID = 'agent_4301k60jbejbebzr750zdg463tr4'; // Update if you have a different agent ID

export async function testTranscriptCapture() {
  console.log('🧪 Testing ElevenLabs Transcript Capture with Enhanced Access...');

  const elevenLabsService = new ElevenLabsService();
  const integrationService = new ConversationIntegrationService();

  const testResults = {
    apiConnection: false,
    conversationsFound: 0,
    transcriptData: null as any,
    errors: [] as string[],
  };

  try {
    // Test 1: Try to get conversations via agent endpoint (known to fail)
    console.log('📡 Testing agent conversations endpoint...');
    try {
      const conversations = await elevenLabsService.getConversationHistory(AGENT_ID);
      testResults.conversationsFound = conversations.length;
    } catch (error) {
      console.log('⚠️ Agent conversations endpoint failed (expected)');
    }

    // Test 2: Try to get latest conversation dynamically
    console.log('🔍 Testing latest conversation access...');
    const conversation = await elevenLabsService.getLatestConversation(AGENT_ID);

    if (conversation) {
      testResults.apiConnection = true;
      testResults.conversationsFound = 1;
      console.log('✅ Successfully fetched conversation directly!');

      // Test 3: Conversation Data Structure Analysis
      console.log(`📊 Found 1 conversation for testing`);
      const sampleConversation = conversation;
      // The ElevenLabs API returns transcript as an array, not nested messages
      const transcript = sampleConversation.transcript || [];
      testResults.transcriptData = {
        id: sampleConversation.conversation_id,
        hasTranscript: transcript.length > 0,
        messageCount: transcript.length,
        sampleMessage: transcript[0] || null,
        metadata: sampleConversation.metadata,
      };

      console.log('🔍 Sample conversation analysis:');
      console.log(`   ID: ${sampleConversation.conversation_id}`);
      console.log(`   Has transcript: ${transcript.length > 0}`);
      console.log(`   Message count: ${transcript.length}`);
      console.log(`   Agent ID: ${sampleConversation.agent_id}`);
      console.log(`   Status: ${sampleConversation.status}`);

      if (transcript.length > 0) {
        console.log('💬 Sample messages:');
        transcript.slice(0, 3).forEach((msg: any, idx: number) => {
          const message = msg.message || 'No message content';
          console.log(`   ${idx + 1}. [${msg.role}]: ${message.substring(0, 100)}...`);
        });

        // Test 3: Conversation Formatting
        const formattedText = elevenLabsService.formatConversationText(sampleConversation);
        console.log(`📝 Formatted text length: ${formattedText.length} characters`);

        // Test 4: Summary extraction
        const summary = elevenLabsService.extractConversationSummary(sampleConversation);
        console.log('📄 Summary analysis:');
        console.log(`   Key topics (${summary.keyTopics.length}): ${summary.keyTopics.join(', ')}`);
        console.log(`   Participants: ${summary.participantCount}`);
        console.log(`   Duration: ${summary.duration}s`);
      }

      // Test 5: Integration capabilities
      console.log('🔗 Testing integration capabilities...');
      const stats = await integrationService.getConversationStats(AGENT_ID);
      console.log('📈 Integration stats:');
      console.log(`   Stored conversations: ${stats.total_conversations}`);
      console.log(`   Total messages: ${stats.total_messages}`);
      console.log(`   Top topics: ${stats.topics.slice(0, 5).map(t => t.topic).join(', ')}`);
    } else {
      console.log('❌ Failed to fetch conversation directly');
      console.log('⚠️  No conversations found. This could mean:');
      console.log('   1. Conversation ID is incorrect');
      console.log('   2. Agent ID might be incorrect');
      console.log('   3. API access permissions might be limited');
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    testResults.errors.push(errorMessage);
    console.error('❌ Error during testing:', errorMessage);

    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      console.log('🔑 API Key issue - check your VITE_ELEVEN_LABS_API_KEY');
    } else if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
      console.log('🚫 Permission issue - your API key might not have agent access');
    } else if (errorMessage.includes('404')) {
      console.log('🔍 Agent not found - check your agent ID');
    }
  }

  console.log('🎯 Test Summary:');
  console.log(`   API Connection: ${testResults.apiConnection ? '✅' : '❌'}`);
  console.log(`   Conversations Found: ${testResults.conversationsFound}`);
  console.log(`   Errors: ${testResults.errors.length}`);

  if (testResults.errors.length > 0) {
    console.log('❌ Errors encountered:');
    testResults.errors.forEach(err => console.log(`   - ${err}`));
  }

  return testResults;
}

// Enhanced test for real-time monitoring
export async function testRealTimeSync() {
  console.log('🔄 Testing Real-time Conversation Sync...');

  const integrationService = new ConversationIntegrationService();

  try {
    const result = await integrationService.triggerSync(AGENT_ID);

    console.log('📊 Sync Results:');
    console.log(`   Success: ${result.success}`);
    console.log(`   Processed: ${result.processed} conversations`);
    console.log(`   Stored: ${result.stored} new conversations`);
    console.log(`   Errors: ${result.errors.length}`);
    console.log(`   Session ID: ${result.sessionId}`);

    if (result.errors.length > 0) {
      console.log('❌ Sync errors:');
      result.errors.forEach(err => {
        console.log(`   - ${err.conversationId}: ${err.error}`);
      });
    }

    if (result.storedIds.length > 0) {
      console.log(`✅ Successfully stored conversations with IDs: ${result.storedIds.join(', ')}`);
    }

    return result;

  } catch (error) {
    console.error('❌ Real-time sync test failed:', error);
    throw error;
  }
}