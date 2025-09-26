import React, { useState, useEffect } from 'react';
import { ConversationStorageService } from '../services/conversationStorageService';
import type { StoredConversation } from '../services/conversationStorageService';

export const ConversationVerifier: React.FC = () => {
  const [conversations, setConversations] = useState<StoredConversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  const storageService = new ConversationStorageService();

  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get recent conversations
      const recentConversations = await storageService.getConversationsByMetadata(
        { agent_id: 'agent_4301k60jbejbebzr750zdg463tr4' },
        20
      );

      setConversations(recentConversations);

      // Calculate some basic stats
      const totalMessages = recentConversations.reduce(
        (sum, conv) => sum + (conv.conversation_data?.message_count || 0),
        0
      );

      const conversationsWithEmbeddings = recentConversations.filter(
        conv => conv.embedding && Array.isArray(conv.embedding) && conv.embedding.length > 0
      ).length;

      setStats({
        total: recentConversations.length,
        totalMessages,
        withEmbeddings: conversationsWithEmbeddings,
        withoutEmbeddings: recentConversations.length - conversationsWithEmbeddings,
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const testSearch = async () => {
    if (conversations.length === 0) {
      alert('No conversations to search. Please load conversations first.');
      return;
    }

    try {
      const searchResults = await storageService.searchConversations('retirement', 5);
      console.log('🔍 Search results for "retirement":', searchResults);
      alert(`Found ${searchResults.length} conversations related to "retirement". Check console for details.`);
    } catch (err) {
      console.error('Search error:', err);
      alert(`Search failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  const deleteConversation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      await storageService.deleteConversation(id);
      alert('Conversation deleted successfully');
      loadConversations(); // Refresh the list
    } catch (err) {
      alert(`Delete failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        🔍 Supabase Vector Database Verifier
      </h2>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={loadConversations}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isLoading ? '🔄 Loading...' : '🔄 Refresh'}
        </button>

        <button
          onClick={testSearch}
          disabled={isLoading || conversations.length === 0}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
        >
          🔍 Test Search
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <h3 className="text-red-800 font-semibold">❌ Error</h3>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-md">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Conversations</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-md">
            <div className="text-2xl font-bold text-green-600">{stats.totalMessages}</div>
            <div className="text-sm text-gray-600">Total Messages</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-md">
            <div className="text-2xl font-bold text-purple-600">{stats.withEmbeddings}</div>
            <div className="text-sm text-gray-600">With Embeddings</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-md">
            <div className="text-2xl font-bold text-orange-600">{stats.withoutEmbeddings}</div>
            <div className="text-sm text-gray-600">Without Embeddings</div>
          </div>
        </div>
      )}

      {/* Conversations List */}
      {conversations.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">
            📝 Recent Conversations ({conversations.length})
          </h3>

          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-sm font-mono text-gray-500">
                      {conversation.id?.slice(0, 8)}...
                    </span>
                    {conversation.embedding ? (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        ✅ Embedding
                      </span>
                    ) : (
                      <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                        ⚠️ No Embedding
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {new Date(conversation.created_at || '').toLocaleDateString()}
                    </span>
                  </div>

                  {conversation.metadata && (
                    <div className="text-sm text-gray-600 mb-2">
                      <div>Agent: {conversation.metadata.agent_id}</div>
                      <div>Session: {conversation.metadata.session_id}</div>
                      {conversation.metadata.tags && (
                        <div>Tags: {(conversation.metadata.tags as string[]).join(', ')}</div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => deleteConversation(conversation.id!)}
                  className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                >
                  🗑️ Delete
                </button>
              </div>

              <div className="text-sm text-gray-800 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto">
                {conversation.conversation_text?.substring(0, 300)}
                {conversation.conversation_text && conversation.conversation_text.length > 300 && '...'}
              </div>

              {conversation.conversation_data && (
                <div className="mt-2 text-xs text-gray-500">
                  Messages: {conversation.conversation_data.message_count || 0} |
                  Participants: {conversation.conversation_data.participants || 0}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : !isLoading && (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-4">📭</div>
          <div>No conversations found in the database</div>
          <div className="text-sm mt-2">Try running the sync process first</div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 How to Use</h3>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li><strong>Refresh:</strong> Load the latest conversations from Supabase</li>
          <li><strong>Test Search:</strong> Try vector similarity search with the word "retirement"</li>
          <li><strong>Green "Embedding" badge:</strong> Conversation has vector embeddings for search</li>
          <li><strong>Orange "No Embedding" badge:</strong> Stored without embeddings (OpenAI API key needed)</li>
          <li><strong>Delete:</strong> Remove a conversation from the database (careful!)</li>
        </ul>
      </div>
    </div>
  );
};