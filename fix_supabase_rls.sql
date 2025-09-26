-- Fix Supabase Row Level Security (RLS) for conversations table
-- Run this in your Supabase SQL Editor

-- Option 1: Disable RLS entirely (for development/testing)
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;

-- OR Option 2: Keep RLS enabled but allow all operations (more secure)
-- ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations for authenticated and anonymous users
-- CREATE POLICY "Allow all operations on conversations" ON conversations
--   FOR ALL
--   TO authenticated, anon
--   USING (true)
--   WITH CHECK (true);

-- Option 3: More restrictive policy (recommended for production)
-- ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Allow inserts from API calls (for webhooks)
-- CREATE POLICY "Allow conversation inserts" ON conversations
--   FOR INSERT
--   TO authenticated, anon
--   WITH CHECK (true);

-- Allow reads for authenticated users
-- CREATE POLICY "Allow conversation reads" ON conversations
--   FOR SELECT
--   TO authenticated, anon
--   USING (true);

-- Allow updates for authenticated users
-- CREATE POLICY "Allow conversation updates" ON conversations
--   FOR UPDATE
--   TO authenticated, anon
--   USING (true)
--   WITH CHECK (true);

-- Allow deletes for authenticated users
-- CREATE POLICY "Allow conversation deletes" ON conversations
--   FOR DELETE
--   TO authenticated, anon
--   USING (true);

-- Verify the table exists and check current policies
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'conversations';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'conversations';

-- Also make sure the conversations table has the right structure
-- (Uncomment and run if needed)
/*
CREATE TABLE IF NOT EXISTS conversations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    conversation_text TEXT NOT NULL,
    conversation_data JSONB,
    embedding vector(1536), -- For OpenAI embeddings
    metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS conversations_metadata_gin_idx ON conversations USING gin (metadata);
CREATE INDEX IF NOT EXISTS conversations_agent_id_idx ON conversations USING btree ((metadata->>'agent_id'));
CREATE INDEX IF NOT EXISTS conversations_created_at_idx ON conversations USING btree (created_at DESC);
CREATE INDEX IF NOT EXISTS conversations_embedding_idx ON conversations USING ivfflat (embedding vector_cosine_ops);
*/