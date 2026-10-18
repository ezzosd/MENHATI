import type { SupabaseClient } from "@supabase/supabase-js";

export type Scholarship = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  country: string;
  university: string | null;
  degree_level: string | null;
  field_of_study: string | null;
  funding_type: string | null;
  deadline: string | null;
  application_url: string | null;
  status: "draft" | "published" | "closed";
  created_at: string;
};

export async function getPublishedScholarships(
  supabase: SupabaseClient,
  search: string,
) {
  let query = supabase
    .from("scholarships")
    .select(
      "id, title, slug, summary, description, country, university, degree_level, field_of_study, funding_type, deadline, application_url, status, created_at",
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const normalizedSearch = search.trim().slice(0, 100);
  if (normalizedSearch) {
    query = query.ilike("title", `%${normalizedSearch}%`);
  }

  return query;
}

export function formatDeadline(deadline: string | null) {
  if (!deadline) {
    return "يُعلن لاحقًا";
  }

  return new Intl.DateTimeFormat("ar", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(new Date(`${deadline}T12:00:00Z`));
}
