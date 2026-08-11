import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function isSupabaseConfigured(): boolean {
  return (
    !!supabaseUrl &&
    !!supabaseAnonKey &&
    supabaseUrl.startsWith("http") &&
    !supabaseUrl.includes("your_") &&
    !supabaseAnonKey.includes("your_")
  );
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured() || !supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured() || !supabaseUrl || !supabaseAnonKey) return null;
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
