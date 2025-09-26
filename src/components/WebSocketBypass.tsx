import React, { useState } from 'react';
import { directApiService, type DirectSyncResult } from '../services/directApiService';

export const WebSocketBypass: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<DirectSyncResult[]>([]);
  const [agentId, setAgentId] = useState('agent_4301k60jbejbebzr750zdg463tr4');
  const [manualData, setManualData] = useState('');
  const [activeMethod, setActiveMethod] = useState<string>('');

  const runMethod = async (methodName: string, methodFn: () => Promise<DirectSyncResult>) => {
    setIsLoading(true);
    setActiveMethod(methodName);

    try {
      const result = await methodFn();
      setResults(prev => [...prev, result]);

      if (result.success) {
        alert(`✅ ${methodName} succeeded! Stored ${result.conversationsStored} conversations.`);
      } else {
        alert(`❌ ${methodName} failed: ${result.errors.join(', ')}`);
      }
    } catch (error) {
      alert(`❌ ${methodName} error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
      setActiveMethod('');
    }
  };

  const clearResults = () => setResults([]);

  const insertSampleData = () => {
    const sample = directApiService.getSampleConversationData();
    setManualData(JSON.stringify(sample, null, 2));
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-red-50 border-2 border-red-200 rounded-lg">
      <h2 className="text-2xl font-bold text-red-800 mb-4">
        ⚠️ WebSocket Bypass Methods
      </h2>
      <p className="text-red-700 mb-6">
        Use these methods if WebSocket issues are preventing normal sync
      </p>

      {/* Agent ID Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Agent ID:
        </label>
        <input
          type="text"
          value={agentId}
          onChange={(e) => setAgentId(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          disabled={isLoading}
        />
      </div>

      {/* Bypass Methods */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">

        {/* Method 1: Direct Fetch */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">🔄 Method 1: Direct Fetch</h3>
          <p className="text-sm text-gray-600 mb-4">
            Uses direct fetch() with custom headers to bypass WebSocket issues
          </p>
          <button
            onClick={() => runMethod('Direct Fetch', () => directApiService.syncViaDirectFetch(agentId))}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md font-medium ${
              isLoading && activeMethod === 'Direct Fetch'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {isLoading && activeMethod === 'Direct Fetch' ? '🔄 Running...' : '🚀 Try Direct Fetch'}
          </button>
        </div>

        {/* Method 2: XMLHttpRequest */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">📡 Method 2: XMLHttpRequest</h3>
          <p className="text-sm text-gray-600 mb-4">
            Uses XMLHttpRequest instead of fetch() to avoid modern API conflicts
          </p>
          <button
            onClick={() => runMethod('XMLHttpRequest', () => directApiService.syncViaXMLHttpRequest(agentId))}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md font-medium ${
              isLoading && activeMethod === 'XMLHttpRequest'
                ? 'bg-green-100 text-green-700'
                : 'bg-green-600 text-white hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {isLoading && activeMethod === 'XMLHttpRequest' ? '🔄 Running...' : '📡 Try XMLHttpRequest'}
          </button>
        </div>

        {/* Method 3: Test Proxy Server */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">🔧 Method 3: Test Proxy</h3>
          <p className="text-sm text-gray-600 mb-4">
            Tests if the proxy server is running and APIs are accessible
          </p>
          <button
            onClick={() => runMethod('Test Proxy Server', () => directApiService.testProxyServer())}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md font-medium ${
              isLoading && activeMethod === 'Test Proxy Server'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            } disabled:opacity-50`}
          >
            {isLoading && activeMethod === 'Test Proxy Server' ? '🔄 Testing...' : '🔧 Test Proxy Server'}
          </button>
        </div>

        {/* Method 4: Get Available Agents */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">👥 Method 4: List Agents</h3>
          <p className="text-sm text-gray-600 mb-4">
            Shows all available agents to find the correct agent ID
          </p>
          <button
            onClick={() => runMethod('Get Available Agents', () => directApiService.getAvailableAgents())}
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md font-medium ${
              isLoading && activeMethod === 'Get Available Agents'
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            } disabled:opacity-50`}
          >
            {isLoading && activeMethod === 'Get Available Agents' ? '🔄 Loading...' : '👥 List Available Agents'}
          </button>
        </div>

        {/* Clear Results */}
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-2">🗑️ Clear Results</h3>
          <p className="text-sm text-gray-600 mb-4">
            Clear all test results and start fresh
          </p>
          <button
            onClick={clearResults}
            disabled={isLoading}
            className="w-full py-2 px-4 rounded-md font-medium bg-gray-600 text-white hover:bg-gray-700 disabled:opacity-50"
          >
            🗑️ Clear Results
          </button>
        </div>
      </div>

      {/* Manual Data Input */}
      <div className="mb-6 bg-white p-4 rounded-lg border">
        <h3 className="font-semibold text-gray-800 mb-2">✏️ Manual Data Input</h3>
        <p className="text-sm text-gray-600 mb-4">
          Paste conversation JSON data directly if API calls fail
        </p>

        <div className="flex gap-2 mb-2">
          <button
            onClick={insertSampleData}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            📝 Insert Sample Data
          </button>
          <button
            onClick={() => setManualData('')}
            className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
          >
            🗑️ Clear
          </button>
        </div>

        <textarea
          value={manualData}
          onChange={(e) => setManualData(e.target.value)}
          placeholder="Paste conversation JSON data here..."
          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
          disabled={isLoading}
        />

        <button
          onClick={() => {
            if (!manualData.trim()) {
              alert('Please enter conversation data first');
              return;
            }
            runMethod('Manual Input', () => directApiService.syncViaManualInput(manualData));
          }}
          disabled={isLoading || !manualData.trim()}
          className={`mt-2 w-full py-2 px-4 rounded-md font-medium ${
            isLoading && activeMethod === 'Manual Input'
              ? 'bg-orange-100 text-orange-700'
              : 'bg-orange-600 text-white hover:bg-orange-700'
          } disabled:opacity-50`}
        >
          {isLoading && activeMethod === 'Manual Input' ? '🔄 Processing...' : '✏️ Import Manual Data'}
        </button>
      </div>

      {/* Results Display */}
      {results.length > 0 && (
        <div className="bg-white p-4 rounded-lg border">
          <h3 className="font-semibold text-gray-800 mb-4">📊 Results ({results.length})</h3>

          <div className="space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  result.success
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className={`font-semibold ${
                      result.success ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {result.success ? '✅' : '❌'} {result.method}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    #{index + 1}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  <div className="text-center">
                    <div className="font-bold text-lg">{result.conversationsFound}</div>
                    <div className="text-xs text-gray-600">Found</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{result.conversationsStored}</div>
                    <div className="text-xs text-gray-600">Stored</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{result.errors.length}</div>
                    <div className="text-xs text-gray-600">Errors</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-bold text-lg ${
                      result.success ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {result.success ? 'SUCCESS' : 'FAILED'}
                    </div>
                  </div>
                </div>

                {result.errors.length > 0 && (
                  <div className="mt-2">
                    <div className="text-sm font-medium text-red-800 mb-1">Errors:</div>
                    <ul className="text-sm text-red-700 list-disc list-inside">
                      {result.errors.map((error, errorIndex) => (
                        <li key={errorIndex}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.details && Object.keys(result.details).length > 0 && (
                  <details className="mt-2">
                    <summary className="text-sm text-gray-600 cursor-pointer">
                      View Details
                    </summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                      {JSON.stringify(result.details, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">💡 How to Use These Bypasses</h3>
        <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
          <li><strong>Start with Method 1 (Direct Fetch):</strong> Most likely to work</li>
          <li><strong>If that fails, try Method 2 (XMLHttpRequest):</strong> Uses older, more compatible API</li>
          <li><strong>Use "Test All Methods":</strong> Automatically tries all methods until one works</li>
          <li><strong>Manual Input:</strong> If all API calls fail, manually paste conversation data</li>
          <li><strong>Check results:</strong> Each method shows detailed success/failure information</li>
        </ol>
        <p className="text-sm text-yellow-700 mt-2">
          <strong>Note:</strong> These bypasses avoid all WebSocket dependencies and make direct HTTP calls to store data in Supabase.
        </p>
      </div>
    </div>
  );
};