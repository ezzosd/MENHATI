"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/server";

function readText(formData: FormData, name: string) {
  return String(formData.get(name) ?? "").trim();
}

function isValidHttpsUrl(value: string) {
  if (!value) return true;

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export async function createScholarship(formData: FormData) {
  const title = readText(formData, "title");
  const slug = readText(formData, "slug");
  const summary = readText(formData, "summary");
  const description = readText(formData, "description");
  const country = readText(formData, "country");
  const university = readText(formData, "university");
  const degreeLevel = readText(formData, "degree_level");
  const fieldOfStudy = readText(formData, "field_of_study");
  const fundingType = readText(formData, "funding_type");
  const deadline = readText(formData, "deadline");
  const applicationUrl = readText(formData, "application_url");
  const parsedDeadline =
    deadline && /^\d{4}-\d{2}-\d{2}$/.test(deadline)
      ? new Date(`${deadline}T00:00:00Z`)
      : null;

  if (
    title.length < 3 ||
    title.length > 200 ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ||
    summary.length < 10 ||
    summary.length > 500 ||
    description.length < 10 ||
    country.length < 2 ||
    country.length > 100 ||
    !isValidHttpsUrl(applicationUrl) ||
    (deadline !== "" &&
      (!parsedDeadline || parsedDeadline.toISOString().slice(0, 10) !== deadline))
  ) {
    redirect("/admin/dashboard?error=invalid");
  }

  const { supabase, user } = await requireAdmin();
  const { error } = await supabase.from("scholarships").insert({
    title,
    slug,
    summary,
    description,
    country,
    university: university || null,
    degree_level: degreeLevel || null,
    field_of_study: fieldOfStudy || null,
    funding_type: fundingType || null,
    deadline: deadline || null,
    application_url: applicationUrl || null,
    created_by: user.id,
  });

  if (error) {
    redirect("/admin/dashboard?error=save");
  }

  revalidatePath("/scholarships");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard?notice=created");
}

export async function updateScholarshipStatus(formData: FormData) {
  const id = readText(formData, "id");
  const status = readText(formData, "status");
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ||
    !["draft", "published", "closed"].includes(status)
  ) {
    redirect("/admin/dashboard?error=invalid");
  }

  const { supabase } = await requireAdmin();
  const { data, error } = await supabase
    .from("scholarships")
    .update({ status })
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error || !data) {
    redirect("/admin/dashboard?error=save");
  }

  revalidatePath("/scholarships");
  revalidatePath(`/scholarships/[slug]`, "page");
  revalidatePath("/admin/dashboard");
  redirect("/admin/dashboard?notice=updated");
}
