import React, { useState, useEffect } from 'react';
import { ConversationIntegrationService } from '../services/conversationIntegrationService';
import { conversationMonitor } from '../services/conversationMonitoringService';
import type { SyncResult } from '../services/conversationIntegrationService';
import type { ConversationMilestone } from '../services/conversationMonitoringService';

export const ConversationSyncTester: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SyncResult | null>(null);
  const [milestones, setMilestones] = useState<ConversationMilestone[]>([]);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [agentId, setAgentId] = useState('agent_4301k60jbejbebzr750zdg463tr4');
  const [logs, setLogs] = useState<string[]>([]);

  const integrationService = new ConversationIntegrationService();

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    setLogs(prev => [...prev, logEntry]);
    console.log(logEntry);
  };

  const updateProgress = (sessionId: string) => {
    const progressData = conversationMonitor.getSessionProgress(sessionId);
    if (progressData) {
      setProgress(progressData.progress);
      setCurrentStep(progressData.current);
      setMilestones(progressData.milestones);
    }
  };

  const handleSync = async () => {
    if (isLoading) return;

    setIsLoading(true);
    setResult(null);
    setLogs([]);
    setProgress(0);
    setCurrentStep('Initializing...');
    setMilestones([]);

    addLog('🚀 Starting conversation sync...');

    try {
      // Override console.log to capture logs
      const originalLog = console.log;
      console.log = (...args) => {
        const message = args.map(arg =>
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        addLog(message);
        originalLog(...args);
      };

      const syncResult = await integrationService.triggerSync(agentId);

      // Restore original console.log
      console.log = originalLog;

      setResult(syncResult);
      updateProgress(syncResult.sessionId);

      if (syncResult.success) {
        addLog(`✅ Sync completed successfully!`);
        addLog(`📊 Processed: ${syncResult.processed}, Stored: ${syncResult.stored}`);
      } else {
        addLog(`❌ Sync completed with errors`);
        addLog(`📊 Processed: ${syncResult.processed}, Stored: ${syncResult.stored}, Errors: ${syncResult.errors.length}`);
      }

      // Show stored conversation IDs
      if (syncResult.storedIds.length > 0) {
        addLog(`💾 Stored conversation IDs:`);
        syncResult.storedIds.forEach((id, index) => {
          addLog(`  ${index + 1}. ${id}`);
        });
      }

      // Show errors if any
      if (syncResult.errors.length > 0) {
        addLog(`❌ Errors encountered:`);
        syncResult.errors.forEach((error, index) => {
          addLog(`  ${index + 1}. ${error.conversationId}: ${error.error}`);
        });
      }

    } catch (error) {
      addLog(`❌ Sync failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  const getMilestoneIcon = (status: ConversationMilestone['status']) => {
    switch (status) {
      case 'completed': return '✅';
      case 'error': return '❌';
      case 'in_progress': return '🔄';
      default: return '⏸️';
    }
  };

  const getMilestoneColor = (status: ConversationMilestone['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'in_progress': return 'text-blue-600';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🤖 ElevenLabs to Supabase Sync Tester
      </h2>

      {/* Agent ID Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agent ID:
        </label>
        <input
          type="text"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter ElevenLabs Agent ID"
          disabled={isLoading}
        />
      </div>

      {/* Sync Button */}
      <button
        onClick={handleSync}
        disabled={isLoading}
        className={`w-full py-3 px-6 rounded-md font-semibold text-white transition-colors ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? '🔄 Syncing...' : '🚀 Start Sync'}
      </button>

      {/* Progress Bar */}
      {isLoading && (
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>{currentStep}</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Milestones */}
      {milestones.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Progress Milestones</h3>
          <div className="space-y-2">
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={`p-3 rounded-md border-l-4 ${
                  milestone.status === 'completed' ? 'border-green-500 bg-green-50' :
                  milestone.status === 'error' ? 'border-red-500 bg-red-50' :
                  milestone.status === 'in_progress' ? 'border-blue-500 bg-blue-50' :
                  'border-gray-300 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getMilestoneIcon(milestone.status)}</span>
                  <span className={`font-medium ${getMilestoneColor(milestone.status)}`}>
                    {milestone.name}
                  </span>
                  {milestone.timestamp && (
                    <span className="text-xs text-gray-500">
                      {new Date(milestone.timestamp).toLocaleTimeString()}
                    </span>
                  )}
                </div>
                {milestone.details && (
                  <div className="mt-2 text-sm text-gray-600 pl-8">
                    {typeof milestone.details === 'object' ? (
                      <pre className="text-xs">{JSON.stringify(milestone.details, null, 2)}</pre>
                    ) : (
                      <span>{milestone.details}</span>
                    )}
                  </div>
                )}
                {milestone.error && (
                  <div className="mt-2 text-sm text-red-600 pl-8">
                    ❌ {milestone.error}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Results Summary */}
      {result && (
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📈 Final Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{result.processed}</div>
              <div className="text-sm text-gray-600">Processed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{result.stored}</div>
              <div className="text-sm text-gray-600">Stored</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{result.errors.length}</div>
              <div className="text-sm text-gray-600">Errors</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                {result.success ? '✅' : '❌'}
              </div>
              <div className="text-sm text-gray-600">Success</div>
            </div>
          </div>
        </div>
      )}

      {/* Live Logs */}
      {logs.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">📝 Live Logs</h3>
          <div className="bg-black text-green-400 p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Instructions</h3>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Enter your ElevenLabs Agent ID (or use the default)</li>
          <li>Click "Start Sync" to begin the process</li>
          <li>Watch the real-time progress and milestones</li>
          <li>Check the logs for detailed information</li>
          <li>View the final results summary</li>
        </ol>
      </div>
    </div>
  );
};