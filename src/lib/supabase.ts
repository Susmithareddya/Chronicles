import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for the conversations table
export interface ConversationRow {
  id?: string;
  created_at?: string;
  updated_at?: string;
  conversation_text: string;
  conversation_data: any;
  embedding?: number[];
  metadata?: {
    user_id?: string;
    session_id?: string;
    tags?: string[];
    [key: string]: any;
  };
}