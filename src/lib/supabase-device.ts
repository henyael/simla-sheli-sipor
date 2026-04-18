import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { getDeviceId } from "./device";

// Per-device Supabase client that sends the anonymous device identifier
// as a request header. RLS policies on `stories` use this header to scope
// read/insert/delete to rows owned by the same device — no login required.

let _client: ReturnType<typeof createClient<Database>> | undefined;

export function getDeviceSupabase() {
  if (_client) return _client;
  const url = import.meta.env.VITE_SUPABASE_URL as string;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;
  _client = createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        "x-device-id": getDeviceId(),
      },
    },
  });
  return _client;
}
