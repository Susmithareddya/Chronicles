-- Enable the pgvector extension for vector operations
CREATE EXTENSION IF NOT EXISTS vector;

-- Create conversations table (if not exists)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversation_text TEXT NOT NULL,
  conversation_data JSONB, -- Array of messages
  embedding VECTOR(1536), -- OpenAI embeddings are 1536 dimensions
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS conversations_embedding_idx
ON conversations USING ivfflat (embedding vector_cosine_ops);

CREATE INDEX IF NOT EXISTS conversations_created_at_idx
ON conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS conversations_metadata_session_idx
ON conversations USING gin((metadata->'session_id'));

-- Function to search for similar conversations using vector similarity
CREATE OR REPLACE FUNCTION search_conversations(
  query_embedding vector(1536),
  similarity_threshold float DEFAULT 0.7,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  conversation_text text,
  conversation_data jsonb,
  metadata jsonb,
  similarity float
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    conversations.id,
    conversations.conversation_text,
    conversations.conversation_data,
    conversations.metadata,
    1 - (conversations.embedding <=> query_embedding) AS similarity
  FROM conversations
  WHERE conversations.embedding IS NOT NULL
    AND 1 - (conversations.embedding <=> query_embedding) > similarity_threshold
  ORDER BY conversations.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Function to search conversations by text (fallback when vector search fails)
CREATE OR REPLACE FUNCTION search_conversations_by_text(
  search_query text,
  match_count int DEFAULT 5
)
RETURNS TABLE (
  id uuid,
  conversation_text text,
  conversation_data jsonb,
  metadata jsonb,
  rank float
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    conversations.id,
    conversations.conversation_text,
    conversations.conversation_data,
    conversations.metadata,
    ts_rank(to_tsvector('english', conversation_text), plainto_tsquery('english', search_query)) AS rank
  FROM conversations
  WHERE to_tsvector('english', conversation_text) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC
  LIMIT match_count;
$$;

-- Create RLS (Row Level Security) policies if needed
-- ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Example policy for authenticated users (uncomment if you want to restrict access)
-- CREATE POLICY "Users can view their own conversations"
-- ON conversations FOR SELECT
-- USING (auth.uid()::text = (metadata->>'user_id'));

-- CREATE POLICY "Users can insert their own conversations"
-- ON conversations FOR INSERT
-- WITH CHECK (auth.uid()::text = (metadata->>'user_id'));

-- Grant permissions
GRANT SELECT, INSERT ON conversations TO authenticated;
GRANT SELECT, INSERT ON conversations TO anon;

-- Optional: Create a view for recent conversations
CREATE OR REPLACE VIEW recent_conversations AS
SELECT
  id,
  conversation_text,
  conversation_data,
  metadata,
  created_at,
  (metadata->>'session_id') as session_id,
  (metadata->>'user_id') as user_id
FROM conversations
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;