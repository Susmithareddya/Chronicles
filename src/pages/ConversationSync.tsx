import { ConversationSyncDashboard } from '../components/ConversationSyncDashboard';
import { ConversationSyncTester } from '../components/ConversationSyncTester';
import { ConversationVerifier } from '../components/ConversationVerifier';
import { WebSocketBypass } from '../components/WebSocketBypass';
import { WebhookTester } from '../components/WebhookTester';
import { QuickTestButton } from '../components/QuickTestButton';
import { TranscriptTestDashboard } from '../components/TranscriptTestDashboard';

export default function ConversationSync() {
  return (
    <div className="space-y-8">
      <TranscriptTestDashboard />
      <QuickTestButton />
      <WebhookTester />
      <WebSocketBypass />
      <ConversationSyncTester />
      <ConversationVerifier />
      <ConversationSyncDashboard />
    </div>
  );
}