import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { useConversationSync, useConversationSearch } from '../hooks/useConversationSync';
import { Download, Search, RefreshCw, Database, MessageCircle, Clock, Tag } from 'lucide-react';

export function ConversationSyncDashboard() {
  const { syncState, startSync, getStats, clearError } = useConversationSync();
  const { searchState, search, clearResults } = useConversationSearch();
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [agentId] = useState('agent_4301k60jbejbebzr750zdg463tr4');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const statsData = await getStats(agentId);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSync = async () => {
    try {
      await startSync(agentId);
      await loadStats(); // Refresh stats after sync
    } catch (error) {
      // Error is already handled in the hook
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await search(searchQuery.trim());
    }
  };

  const formatDate = (timestamp: number | string) => {
    return new Date(timestamp).toLocaleDateString();
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Retirement Knowledge Sync</h1>
          <p className="text-muted-foreground">
            Sync and search conversations from ElevenLabs retirement agent
          </p>
        </div>
      </div>

      {syncState.error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">
            {syncState.error}
            <Button
              variant="ghost"
              size="sm"
              className="ml-2"
              onClick={clearError}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sync">Sync</TabsTrigger>
          <TabsTrigger value="search">Search</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Conversations</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.total_conversations || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.total_messages || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Date Range</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {stats?.date_range?.earliest
                    ? `${formatDate(stats.date_range.earliest)} - ${formatDate(stats.date_range.latest)}`
                    : 'No data'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Last Sync</CardTitle>
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {syncState.lastResult
                    ? `${syncState.lastResult.stored} stored`
                    : 'Never'}
                </div>
              </CardContent>
            </Card>
          </div>

          {stats?.topics && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Top Topics
                </CardTitle>
                <CardDescription>
                  Most frequently discussed topics in conversations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {stats.topics.slice(0, 15).map((topic: any, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {topic.topic} ({topic.count})
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Sync Conversations
              </CardTitle>
              <CardDescription>
                Fetch new conversations from ElevenLabs and store them in the vector database
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Button
                  onClick={handleSync}
                  disabled={syncState.isLoading}
                  className="flex items-center gap-2"
                >
                  {syncState.isLoading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {syncState.isLoading ? 'Syncing...' : 'Start Sync'}
                </Button>

                <Badge variant="outline" className="text-xs">
                  Agent: {agentId}
                </Badge>
              </div>

              {syncState.isLoading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{syncState.progress.status}</span>
                    <span>
                      {syncState.progress.current} / {syncState.progress.total}
                    </span>
                  </div>
                  <Progress
                    value={
                      syncState.progress.total > 0
                        ? (syncState.progress.current / syncState.progress.total) * 100
                        : 0
                    }
                  />
                </div>
              )}

              {syncState.lastResult && (
                <div className="rounded-lg border p-4 space-y-2">
                  <h4 className="font-medium">Last Sync Result</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Processed:</span>{' '}
                      {syncState.lastResult.processed}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Stored:</span>{' '}
                      {syncState.lastResult.stored}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Errors:</span>{' '}
                      {syncState.lastResult.errors.length}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Success:</span>{' '}
                      <Badge variant={syncState.lastResult.success ? 'default' : 'destructive'}>
                        {syncState.lastResult.success ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>

                  {syncState.lastResult.errors.length > 0 && (
                    <details className="mt-4">
                      <summary className="cursor-pointer text-sm text-red-600">
                        View Errors ({syncState.lastResult.errors.length})
                      </summary>
                      <div className="mt-2 space-y-1">
                        {syncState.lastResult.errors.map((error, index) => (
                          <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                            <strong>{error.conversationId}:</strong> {error.error}
                          </div>
                        ))}
                      </div>
                    </details>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Conversations
              </CardTitle>
              <CardDescription>
                Use natural language to search through stored conversations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Search for specific topics, advice, or experiences..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={searchState.isSearching}>
                  {searchState.isSearching ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
                {searchState.results.length > 0 && (
                  <Button variant="outline" onClick={clearResults}>
                    Clear
                  </Button>
                )}
              </form>

              {searchState.error && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {searchState.error}
                  </AlertDescription>
                </Alert>
              )}

              {searchState.results.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">
                      Search Results ({searchState.results.length})
                    </h4>
                    <Badge variant="outline">
                      Query: "{searchState.query}"
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {searchState.results.map((conversation) => (
                      <Card key={conversation.id} className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="space-y-1">
                                <div className="text-sm text-muted-foreground">
                                  {conversation.created_at
                                    ? formatDate(conversation.created_at)
                                    : 'Unknown date'}
                                </div>
                                {'similarity_score' in conversation && (
                                  <Badge variant="secondary" className="text-xs">
                                    {Math.round((conversation.similarity_score || 0) * 100)}% match
                                  </Badge>
                                )}
                              </div>
                            </div>

                            <p className="text-sm leading-relaxed">
                              {conversation.conversation_text.substring(0, 300)}
                              {conversation.conversation_text.length > 300 ? '...' : ''}
                            </p>

                            {conversation.metadata?.key_topics && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {conversation.metadata.key_topics.slice(0, 5).map((topic: string, index: number) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {topic}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {searchState.query && searchState.results.length === 0 && !searchState.isSearching && !searchState.error && (
                <div className="text-center py-8 text-muted-foreground">
                  No conversations found matching "{searchState.query}"
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}