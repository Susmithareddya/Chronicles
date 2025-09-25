import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.REACT_APP_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL:', supabaseUrl);
  console.error('Supabase Key:', supabaseKey ? 'Present' : 'Missing');
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface ConversationRecord {
  id?: string;
  created_at?: string;
  conversation_text: string;
  conversation_data: any; // JSON array of messages
  embedding?: number[]; // Vector embedding
  metadata?: {
    user_id?: string;
    session_id?: string;
    message_count?: number;
    duration?: number;
    tags?: string[];
  };
}