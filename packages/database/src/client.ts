import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type Database = Record<string, unknown>;

export type SupabaseBrowserClient = SupabaseClient;
export type SupabaseServerClient = SupabaseClient;

type ServerClientOptions = {
  supabaseUrl?: string;
  serviceRoleKey?: string;
};

function readPublicSupabaseConfig() {
  return {
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    url: process.env.NEXT_PUBLIC_SUPABASE_URL
  };
}

export function createBrowserSupabaseClient(): SupabaseBrowserClient | null {
  const { anonKey, url } = readPublicSupabaseConfig();

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false
    }
  });
}

export function createServerSupabaseClient(options: ServerClientOptions = {}): SupabaseServerClient | null {
  const url = options.supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = options.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}
