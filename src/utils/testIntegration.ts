import { ConversationIntegrationService } from '../services/conversationIntegrationService';
import { ElevenLabsService } from '../services/elevenlabsService';
import { EmbeddingService } from '../services/embeddingService';

/**
 * Test function to verify the ElevenLabs to Supabase integration
 */
export async function testConversationIntegration() {
  console.log('🧪 Starting integration test...');

  try {
    // Test 1: Check environment variables
    console.log('1️⃣ Checking environment variables...');
    const requiredEnvVars = [
      'VITE_ELEVEN_LABS_API_KEY',
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !import.meta.env[varName] || import.meta.env[varName] === 'your-api-key-here'
    );

    if (missingVars.length > 0) {
      console.error('❌ Missing environment variables:', missingVars);
      return false;
    }
    console.log('✅ Environment variables configured');

    // Test 2: Test ElevenLabs API connection
    console.log('2️⃣ Testing ElevenLabs API connection...');
    const elevenLabsService = new ElevenLabsService();
    const agentId = 'agent_4301k60jbejbebzr750zdg463tr4';

    try {
      const conversations = await elevenLabsService.getConversationHistory(agentId);
      console.log(`✅ ElevenLabs API working - found ${conversations.length} conversations`);

      if (conversations.length > 0) {
        const firstConv = conversations[0];
        console.log('📋 Sample conversation:', {
          id: firstConv.id,
          messageCount: firstConv.transcript.messages?.length || 0,
          createdAt: firstConv.created_at,
        });
      }
    } catch (error) {
      console.error('❌ ElevenLabs API error:', error);
      return false;
    }

    // Test 3: Test OpenAI embeddings (if API key is available)
    console.log('3️⃣ Testing OpenAI embeddings...');
    const embeddingService = new EmbeddingService();

    try {
      const testText = 'This is a test conversation about retirement planning and career advice.';
      const embedding = await embeddingService.generateEmbedding(testText);

      if (embedding && embedding.length > 0) {
        console.log(`✅ OpenAI embeddings working - generated ${embedding.length}-dimensional vector`);
      } else {
        console.log('⚠️ OpenAI embeddings not available (API key not configured)');
      }
    } catch (error) {
      console.error('❌ OpenAI embeddings error:', error);
      console.log('⚠️ Continuing without embeddings...');
    }

    // Test 4: Test complete integration
    console.log('4️⃣ Testing complete integration...');
    const integrationService = new ConversationIntegrationService();

    try {
      const stats = await integrationService.getConversationStats(agentId);
      console.log('✅ Integration service working - current stats:', stats);
    } catch (error) {
      console.error('❌ Integration service error:', error);
      return false;
    }

    console.log('🎉 All tests passed! Integration is ready to use.');
    return true;
  } catch (error) {
    console.error('❌ Integration test failed:', error);
    return false;
  }
}

/**
 * Test function for manual sync verification
 */
export async function testManualSync(dryRun: boolean = true) {
  console.log(`🔄 Starting ${dryRun ? 'dry-run' : 'live'} sync test...`);

  try {
    const integrationService = new ConversationIntegrationService();
    const agentId = 'agent_4301k60jbejbebzr750zdg463tr4';

    if (dryRun) {
      // Just test the ElevenLabs fetch without storing
      const elevenLabsService = new ElevenLabsService();
      const conversations = await elevenLabsService.getConversationHistory(agentId);

      console.log(`📊 Found ${conversations.length} conversations to potentially sync`);

      if (conversations.length > 0) {
        const sample = conversations[0];
        const formatted = elevenLabsService.formatConversationText(sample);
        const summary = elevenLabsService.extractConversationSummary(sample);

        console.log('📝 Sample formatted conversation (first 200 chars):');
        console.log(formatted.substring(0, 200) + '...');
        console.log('🏷️ Sample summary:', summary);
      }
    } else {
      // Actually perform the sync
      console.log('⚠️ Performing live sync - this will store data in Supabase');
      const result = await integrationService.triggerSync(agentId);

      console.log('✅ Sync completed:', {
        success: result.success,
        processed: result.processed,
        stored: result.stored,
        errors: result.errors.length,
      });

      if (result.errors.length > 0) {
        console.log('❌ Sync errors:');
        result.errors.forEach((error, index) => {
          console.log(`  ${index + 1}. ${error.conversationId}: ${error.error}`);
        });
      }
    }

    return true;
  } catch (error) {
    console.error('❌ Sync test failed:', error);
    return false;
  }
}

/**
 * Test search functionality
 */
export async function testSearchFunctionality(query: string = 'retirement advice') {
  console.log(`🔍 Testing search functionality with query: "${query}"`);

  try {
    const integrationService = new ConversationIntegrationService();
    const results = await integrationService.searchConversations(query, 5);

    console.log(`✅ Search completed - found ${results.length} results`);

    results.forEach((result, index) => {
      console.log(`📄 Result ${index + 1}:`, {
        id: result.id,
        snippet: result.conversation_text.substring(0, 100) + '...',
        similarity: 'similarity_score' in result ? result.similarity_score : 'N/A',
        createdAt: result.created_at,
      });
    });

    return results;
  } catch (error) {
    console.error('❌ Search test failed:', error);
    return [];
  }
}

// Export a combined test suite
export async function runFullTestSuite() {
  console.log('🚀 Running full integration test suite...\n');

  const results = {
    integration: await testConversationIntegration(),
    dryRunSync: await testManualSync(true),
    search: (await testSearchFunctionality()).length > 0,
  };

  console.log('\n📊 Test Suite Results:', results);

  const allPassed = Object.values(results).every(Boolean);
  console.log(allPassed ? '🎉 All tests passed!' : '❌ Some tests failed');

  return results;
}