"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient, getSupabasePublicConfig } from "@/lib/supabase/server";

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!getSupabasePublicConfig()) {
    redirect("/admin/login?error=configuration");
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length === 0) {
    redirect("/admin/login?error=invalid");
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    redirect("/admin/login?error=credentials");
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("role")
    .eq("id", data.user.id)
    .maybeSingle();

  if (profileError) {
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      throw new Error(`Could not clear a non-admin session: ${signOutError.message}`);
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

  redirect("/admin/dashboard");
}

export async function logoutAdmin() {
  if (getSupabasePublicConfig()) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(`Could not sign out: ${error.message}`);
    }
  }

  redirect("/admin/login");
}
