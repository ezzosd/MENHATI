import { createServerClient, type SetAllCookies } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return { url, anonKey };
}

export async function createSupabaseServerClient() {
  const config = getSupabasePublicConfig();
  if (!config) {
    throw new Error("Supabase is not configured. Set the public URL and publishable key.");
  }

  const cookieStore = cookies();

  return createServerClient(config.url, config.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet: Parameters<SetAllCookies>[0]) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server components cannot write cookies; middleware refreshes the session.
        }
      },
    },
  });
}

export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/admin/login");
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw new Error(`Could not clear an unverified session: ${signOutError.message}`);
    }
    redirect("/admin/login?error=access-check");
  }

  if (!profile || profile.role !== "admin") {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw new Error(`Could not clear a non-admin session: ${signOutError.message}`);
    }
    redirect("/admin/login?error=unauthorized");
  }

  return { supabase, user };
}
