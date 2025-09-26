-- Enable the vector extension (run this first if not already enabled)
-- CREATE EXTENSION IF NOT EXISTS vector;

-- Function to match conversations using vector similarity
CREATE OR REPLACE FUNCTION match_conversations(
  query_embedding vector(1536),
  match_threshold float DEFAULT 0.7,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  updated_at timestamptz,
  conversation_text text,
  conversation_data jsonb,
  embedding vector,
  metadata jsonb,
  similarity_score float
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    c.id,
    c.created_at,
    c.updated_at,
    c.conversation_text,
    c.conversation_data,
    c.embedding,
    c.metadata,
    1 - (c.embedding <=> query_embedding) AS similarity_score
  FROM conversations c
  WHERE c.embedding IS NOT NULL
    AND 1 - (c.embedding <=> query_embedding) > match_threshold
  ORDER BY c.embedding <=> query_embedding
  LIMIT match_count;
$$;

-- Function to get conversation statistics
CREATE OR REPLACE FUNCTION get_conversation_stats(agent_id_filter text DEFAULT NULL)
RETURNS TABLE (
  total_conversations bigint,
  total_messages bigint,
  earliest_date timestamptz,
  latest_date timestamptz,
  avg_conversation_length numeric
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    COUNT(*) as total_conversations,
    COALESCE(SUM((conversation_data->>'message_count')::int), 0) as total_messages,
    MIN(created_at) as earliest_date,
    MAX(created_at) as latest_date,
    AVG(LENGTH(conversation_text)) as avg_conversation_length
  FROM conversations
  WHERE (agent_id_filter IS NULL OR metadata->>'agent_id' = agent_id_filter);
$$;

-- Function to search conversations by tags
CREATE OR REPLACE FUNCTION search_conversations_by_tags(
  search_tags text[],
  match_count int DEFAULT 10
)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  conversation_text text,
  metadata jsonb,
  matching_tags text[]
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    c.id,
    c.created_at,
    c.conversation_text,
    c.metadata,
    array(
      SELECT unnest(search_tags)
      INTERSECT
      SELECT jsonb_array_elements_text(c.metadata->'tags')
    ) as matching_tags
  FROM conversations c
  WHERE c.metadata->'tags' ?| search_tags
  ORDER BY
    array_length(array(
      SELECT unnest(search_tags)
      INTERSECT
      SELECT jsonb_array_elements_text(c.metadata->'tags')
    ), 1) DESC,
    c.created_at DESC
  LIMIT match_count;
$$;

-- Function to get recent conversations
CREATE OR REPLACE FUNCTION get_recent_conversations(
  days_back int DEFAULT 30,
  agent_id_filter text DEFAULT NULL,
  match_count int DEFAULT 20
)
RETURNS TABLE (
  id uuid,
  created_at timestamptz,
  conversation_text text,
  metadata jsonb,
  message_count int
)
LANGUAGE SQL STABLE
AS $$
  SELECT
    c.id,
    c.created_at,
    c.conversation_text,
    c.metadata,
    (c.conversation_data->>'message_count')::int as message_count
  FROM conversations c
  WHERE c.created_at > NOW() - (days_back || ' days')::interval
    AND (agent_id_filter IS NULL OR c.metadata->>'agent_id' = agent_id_filter)
  ORDER BY c.created_at DESC
  LIMIT match_count;
$$;

-- Index suggestions for better performance (if not already created)
-- CREATE INDEX IF NOT EXISTS conversations_agent_id_idx ON conversations USING btree ((metadata->>'agent_id'));
-- CREATE INDEX IF NOT EXISTS conversations_tags_gin_idx ON conversations USING gin ((metadata->'tags'));

-- Grant permissions (adjust as needed for your setup)
-- GRANT EXECUTE ON FUNCTION match_conversations TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_conversation_stats TO authenticated;
-- GRANT EXECUTE ON FUNCTION search_conversations_by_tags TO authenticated;
-- GRANT EXECUTE ON FUNCTION get_recent_conversations TO authenticated;