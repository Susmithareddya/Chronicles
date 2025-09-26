import { useState, useCallback } from 'react';
import { ConversationIntegrationService, type SyncResult } from '../services/conversationIntegrationService';
import type { StoredConversation } from '../services/conversationStorageService';
import { storyTileService } from '../data/storiesData';

export interface UseSyncState {
  isLoading: boolean;
  progress: {
    current: number;
    total: number;
    status: string;
  };
  lastResult: SyncResult | null;
  error: string | null;
}

export function useConversationSync() {
  const [syncState, setSyncState] = useState<UseSyncState>({
    isLoading: false,
    progress: { current: 0, total: 0, status: '' },
    lastResult: null,
    error: null,
  });

  const [integrationService] = useState(() => new ConversationIntegrationService());

  const startSync = useCallback(async (agentId?: string) => {
    setSyncState(prev => ({
      ...prev,
      isLoading: true,
      error: null,
      progress: { current: 0, total: 0, status: 'Initializing...' },
    }));

    try {
      const result = await integrationService.triggerSync(agentId);

      setSyncState(prev => ({
        ...prev,
        isLoading: false,
        lastResult: result,
        progress: {
          current: result.stored,
          total: result.processed,
          status: result.success ? 'Completed' : 'Completed with errors',
        },
      }));

      // Trigger conversation completed popup if sync was successful
      if (result.success && result.stored > 0) {
        console.log('🔍 Conversations synced successfully - triggering completion popup...');

        // Dispatch custom event for conversation completion
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('chronicles:conversation:completed', {
            detail: {
              conversationsStored: result.stored,
              timestamp: new Date().toISOString()
            }
          }));
        }

        console.log(`✅ ${result.stored} conversations synced - popup triggered!`);
      }

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sync failed';

      setSyncState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        progress: { ...prev.progress, status: 'Failed' },
      }));

      throw error;
    }
  }, [integrationService]);

  const searchConversations = useCallback(async (query: string, limit?: number) => {
    try {
      return await integrationService.searchConversations(query, limit);
    } catch (error) {
      setSyncState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Search failed',
      }));
      throw error;
    }
  }, [integrationService]);

  const getStats = useCallback(async (agentId?: string) => {
    try {
      return await integrationService.getConversationStats(agentId);
    } catch (error) {
      setSyncState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to get stats',
      }));
      throw error;
    }
  }, [integrationService]);

  const clearError = useCallback(() => {
    setSyncState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    syncState,
    startSync,
    searchConversations,
    getStats,
    clearError,
  };
}

// Hook for managing conversation search
export function useConversationSearch() {
  const [searchState, setSearchState] = useState<{
    isSearching: boolean;
    results: StoredConversation[];
    query: string;
    error: string | null;
  }>({
    isSearching: false,
    results: [],
    query: '',
    error: null,
  });

  const [integrationService] = useState(() => new ConversationIntegrationService());

  const search = useCallback(async (query: string, limit: number = 10) => {
    if (!query.trim()) {
      setSearchState(prev => ({ ...prev, results: [], query: '' }));
      return;
    }

    setSearchState(prev => ({
      ...prev,
      isSearching: true,
      query,
      error: null,
    }));

    try {
      const results = await integrationService.searchConversations(query, limit);

      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        results,
      }));

      return results;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed';

      setSearchState(prev => ({
        ...prev,
        isSearching: false,
        error: errorMessage,
        results: [],
      }));

      throw error;
    }
  }, [integrationService]);

  const clearResults = useCallback(() => {
    setSearchState({
      isSearching: false,
      results: [],
      query: '',
      error: null,
    });
  }, []);

  return {
    searchState,
    search,
    clearResults,
  };
}