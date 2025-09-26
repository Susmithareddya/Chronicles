import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { testTranscriptCapture, testRealTimeSync } from '../utils/testTranscriptCapture';
import { testConversationIntegration } from '../utils/testIntegration';
import { TestTube, RefreshCw, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';

interface TestResults {
  apiConnection: boolean;
  conversationsFound: number;
  transcriptData: any;
  errors: string[];
}

export function TranscriptTestDashboard() {
  const [testing, setTesting] = useState(false);
  const [syncTesting, setSyncTesting] = useState(false);
  const [results, setResults] = useState<TestResults | null>(null);
  const [syncResults, setSyncResults] = useState<any>(null);
  const [integrationResults, setIntegrationResults] = useState<boolean | null>(null);

  const runTranscriptTest = async () => {
    setTesting(true);
    setResults(null);

    try {
      console.log('🚀 Running Enhanced Transcript Capture Test...');
      const testResults = await testTranscriptCapture();
      setResults(testResults);
    } catch (error) {
      console.error('Test failed:', error);
      setResults({
        apiConnection: false,
        conversationsFound: 0,
        transcriptData: null,
        errors: [error instanceof Error ? error.message : String(error)],
      });
    } finally {
      setTesting(false);
    }
  };

  const runIntegrationTest = async () => {
    setTesting(true);
    setIntegrationResults(null);

    try {
      console.log('🔗 Running Integration Test...');
      const result = await testConversationIntegration();
      setIntegrationResults(result);
    } catch (error) {
      console.error('Integration test failed:', error);
      setIntegrationResults(false);
    } finally {
      setTesting(false);
    }
  };

  const runSyncTest = async () => {
    setSyncTesting(true);
    setSyncResults(null);

    try {
      console.log('🔄 Running Real-time Sync Test...');
      const syncResult = await testRealTimeSync();
      setSyncResults(syncResult);
    } catch (error) {
      console.error('Sync test failed:', error);
      setSyncResults({
        success: false,
        processed: 0,
        stored: 0,
        errors: [{ conversationId: 'sync_error', error: error instanceof Error ? error.message : String(error) }],
      });
    } finally {
      setSyncTesting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <TestTube className="w-8 h-8" />
            ElevenLabs Transcript Test
          </h1>
          <p className="text-muted-foreground">
            Test your enhanced ElevenLabs agent access and conversation transcript capture
          </p>
        </div>
      </div>

      {/* Test Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button
          onClick={runTranscriptTest}
          disabled={testing}
          className="h-20 flex-col"
        >
          <TestTube className="w-5 h-5 mb-2" />
          {testing ? 'Testing...' : 'Test Transcript Capture'}
        </Button>

        <Button
          onClick={runIntegrationTest}
          disabled={testing}
          className="h-20 flex-col"
          variant="outline"
        >
          <MessageCircle className="w-5 h-5 mb-2" />
          {testing ? 'Testing...' : 'Test Integration'}
        </Button>

        <Button
          onClick={runSyncTest}
          disabled={syncTesting}
          className="h-20 flex-col"
          variant="secondary"
        >
          <RefreshCw className={`w-5 h-5 mb-2 ${syncTesting ? 'animate-spin' : ''}`} />
          {syncTesting ? 'Syncing...' : 'Test Real-time Sync'}
        </Button>
      </div>

      {/* Integration Test Results */}
      {integrationResults !== null && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {integrationResults ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-600" />
              )}
              Integration Test Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {integrationResults ? (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4" />
                <AlertDescription className="text-green-800">
                  ✅ All systems are working! Your enhanced ElevenLabs access is configured correctly.
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-red-800">
                  ❌ Integration test failed. Check the console for details.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transcript Test Results */}
      {results && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TestTube className="w-5 h-5" />
              Transcript Capture Test Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* API Connection Status */}
            <div className="flex items-center gap-2">
              <Badge variant={results.apiConnection ? "default" : "destructive"}>
                API Connection: {results.apiConnection ? 'Success' : 'Failed'}
              </Badge>
              <Badge variant="outline">
                Conversations Found: {results.conversationsFound}
              </Badge>
            </div>

            {/* Errors */}
            {results.errors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-red-800">
                  <strong>Errors:</strong>
                  <ul className="mt-2 list-disc list-inside">
                    {results.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {/* Transcript Data */}
            {results.transcriptData && (
              <div className="space-y-3">
                <h3 className="font-semibold">Sample Conversation Data:</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>ID:</strong> {results.transcriptData.id}
                  </div>
                  <div>
                    <strong>Has Transcript:</strong> {results.transcriptData.hasTranscript ? '✅' : '❌'}
                  </div>
                  <div>
                    <strong>Message Count:</strong> {results.transcriptData.messageCount}
                  </div>
                  <div>
                    <strong>Agent ID:</strong> {results.transcriptData.metadata?.agent_id || 'N/A'}
                  </div>
                </div>

                {results.transcriptData.sampleMessage && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <strong>Sample Message:</strong>
                    <div className="mt-1">
                      <Badge variant="outline">{results.transcriptData.sampleMessage.role}</Badge>
                      <p className="mt-1 text-sm">{results.transcriptData.sampleMessage.content?.substring(0, 200) || results.transcriptData.sampleMessage.message?.substring(0, 200) || 'No message content'}...</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Success message */}
            {results.apiConnection && results.conversationsFound > 0 && results.errors.length === 0 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4" />
                <AlertDescription className="text-green-800">
                  🎉 <strong>Success!</strong> Your enhanced ElevenLabs access is working perfectly.
                  You can now capture conversation transcripts with {results.conversationsFound} conversations available.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Sync Results */}
      {syncResults && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5" />
              Real-time Sync Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <strong>Status:</strong>
                <Badge variant={syncResults.success ? "default" : "destructive"} className="ml-2">
                  {syncResults.success ? 'Success' : 'Failed'}
                </Badge>
              </div>
              <div>
                <strong>Session ID:</strong> {syncResults.sessionId}
              </div>
              <div>
                <strong>Processed:</strong> {syncResults.processed} conversations
              </div>
              <div>
                <strong>Stored:</strong> {syncResults.stored} new conversations
              </div>
            </div>

            {syncResults.errors && syncResults.errors.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertCircle className="w-4 h-4" />
                <AlertDescription className="text-yellow-800">
                  <strong>Sync Errors ({syncResults.errors.length}):</strong>
                  <ul className="mt-2 list-disc list-inside text-sm">
                    {syncResults.errors.slice(0, 5).map((error: any, index: number) => (
                      <li key={index}>{error.conversationId}: {error.error}</li>
                    ))}
                    {syncResults.errors.length > 5 && (
                      <li>... and {syncResults.errors.length - 5} more errors</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {syncResults.storedIds && syncResults.storedIds.length > 0 && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="w-4 h-4" />
                <AlertDescription className="text-green-800">
                  ✅ Successfully synced {syncResults.storedIds.length} new conversations to your knowledge base!
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div>
            <strong>1. Test Transcript Capture:</strong> Verifies your ElevenLabs API access and shows sample conversation data
          </div>
          <div>
            <strong>2. Test Integration:</strong> Checks all connections (ElevenLabs, Supabase, OpenAI) and environment variables
          </div>
          <div>
            <strong>3. Test Real-time Sync:</strong> Actually syncs new conversations to your database with full monitoring
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded">
            <strong>💡 Tip:</strong> Check your browser's console for detailed logs and debugging information during tests.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}