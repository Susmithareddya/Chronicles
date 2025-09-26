import { ConversationIntegrationService } from '../services/conversationIntegrationService';
import { conversationMonitor } from '../services/conversationMonitoringService';

/**
 * Test function to demonstrate the conversation sync with monitoring milestones
 */
export async function testConversationSync(agentId?: string): Promise<void> {
  console.log('🚀 Starting Conversation Sync Test with Monitoring');
  console.log('================================================\n');

  const integrationService = new ConversationIntegrationService();

  try {
    // Start the sync process with monitoring
    const result = await integrationService.triggerSync(agentId);

    console.log('\n📊 Final Results:');
    console.log('==================');
    console.log(`Session ID: ${result.sessionId}`);
    console.log(`Success: ${result.success ? '✅' : '❌'}`);
    console.log(`Processed: ${result.processed} conversations`);
    console.log(`Stored: ${result.stored} conversations`);
    console.log(`Errors: ${result.errors.length}`);

    if (result.errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      result.errors.forEach((error, index) => {
        console.log(`${index + 1}. ${error.conversationId}: ${error.error}`);
      });
    }

    if (result.storedIds.length > 0) {
      console.log('\n✅ Successfully stored conversations:');
      result.storedIds.forEach((id, index) => {
        console.log(`${index + 1}. ${id}`);
      });
    }

    // Show final milestone status
    const finalProgress = conversationMonitor.getSessionProgress(result.sessionId);
    if (finalProgress) {
      console.log('\n📈 Milestone Progress:');
      console.log('=====================');
      finalProgress.milestones.forEach(milestone => {
        const statusIcon = milestone.status === 'completed' ? '✅' :
                          milestone.status === 'error' ? '❌' :
                          milestone.status === 'in_progress' ? '🔄' : '⏸️';
        console.log(`${statusIcon} ${milestone.name} (${milestone.status})`);
        if (milestone.error) {
          console.log(`   Error: ${milestone.error}`);
        }
        if (milestone.details) {
          console.log(`   Details: ${JSON.stringify(milestone.details)}`);
        }
      });
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
  }

  console.log('\n🏁 Test completed');
}

/**
 * Monitor an existing session
 */
export function monitorSession(sessionId: string): void {
  const progress = conversationMonitor.getSessionProgress(sessionId);

  if (!progress) {
    console.log(`❌ No session found with ID: ${sessionId}`);
    return;
  }

  console.log(`📊 Session ${sessionId} Progress: ${progress.progress}%`);
  console.log(`Current: ${progress.current}`);
  console.log(`Completed: ${progress.completed}/${progress.milestones.length}`);
  console.log(`Failed: ${progress.failed}`);

  console.log('\nDetailed Milestones:');
  progress.milestones.forEach(milestone => {
    const statusIcon = milestone.status === 'completed' ? '✅' :
                      milestone.status === 'error' ? '❌' :
                      milestone.status === 'in_progress' ? '🔄' : '⏸️';
    console.log(`${statusIcon} ${milestone.name}`);
  });
}

/**
 * List all active monitoring sessions
 */
export function listActiveSessions(): void {
  const sessions = conversationMonitor.getActiveSessions();

  if (sessions.length === 0) {
    console.log('No active monitoring sessions found');
    return;
  }

  console.log(`📋 Active Sessions (${sessions.length}):`);
  sessions.forEach((session, index) => {
    const progress = conversationMonitor.getSessionProgress(session.sessionId);
    console.log(`${index + 1}. ${session.sessionId}`);
    console.log(`   Agent: ${session.agentId}`);
    console.log(`   Started: ${new Date(session.startTime).toLocaleString()}`);
    console.log(`   Progress: ${progress?.progress || 0}%`);
    console.log(`   Current: ${progress?.current || 'Unknown'}`);
  });
}

// Usage examples for the console
if (typeof window !== 'undefined') {
  // Make functions available globally for testing in browser console
  (window as any).testConversationSync = testConversationSync;
  (window as any).monitorSession = monitorSession;
  (window as any).listActiveSessions = listActiveSessions;

  console.log('🔧 Test functions available globally:');
  console.log('- testConversationSync(agentId?) - Run full sync test');
  console.log('- monitorSession(sessionId) - Monitor specific session');
  console.log('- listActiveSessions() - List all active sessions');
}