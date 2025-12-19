// Educational Project: CampusConnect
// Supabase client configuration for database and authentication

import { createClient } from '@supabase/supabase-js';

// Get environment variables for Supabase connection
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create and export a single Supabase client instance
// This client handles all database operations and authentication
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
