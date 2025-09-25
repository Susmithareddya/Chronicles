-- Simple conversations table without vector extension (for initial testing)
CREATE TABLE IF NOT EXISTS conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  conversation_text TEXT NOT NULL,
  conversation_data JSONB, -- Array of messages
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS conversations_created_at_idx
ON conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS conversations_metadata_session_idx
ON conversations USING gin((metadata->'session_id'));

-- Create text search index
CREATE INDEX IF NOT EXISTS conversations_text_search_idx
ON conversations USING gin(to_tsvector('english', conversation_text));

-- Function to search conversations by text
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