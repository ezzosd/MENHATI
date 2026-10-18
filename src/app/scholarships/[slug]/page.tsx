import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { formatDeadline } from "@/lib/scholarships";
import {
  createSupabaseServerClient,
  getSupabasePublicConfig,
} from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = {
  title: "تفاصيل المنحة | منحتي",
};

type ScholarshipDetailsPageProps = {
  params: { slug: string };
};

export default async function ScholarshipDetailsPage({
  params,
}: ScholarshipDetailsPageProps) {
  const config = getSupabasePublicConfig();
  let scholarship = null;
  let loadError = false;

  if (config) {
    const supabase = await createSupabaseServerClient();
    const result = await supabase
      .from("scholarships")
      .select(
        "title, summary, description, country, university, degree_level, field_of_study, funding_type, deadline, application_url",
      )
      .eq("slug", params.slug)
      .eq("status", "published")
      .maybeSingle();
    scholarship = result.data;
    loadError = Boolean(result.error);
  }

  return (
    <>
      <SiteHeader />
      <main className="detail-shell">
        <a className="back-link" href="/scholarships">
          ← العودة إلى المنح
        </a>
        {!config ? (
          <div className="notice" role="status">
            أضف إعدادات Supabase إلى <code>.env.local</code> لعرض تفاصيل المنحة.
          </div>
        ) : loadError ? (
          <div className="notice notice-error" role="alert">
            تعذر تحميل تفاصيل المنحة. تحقق من الاتصال بقاعدة البيانات ثم أعد
            المحاولة.
          </div>
        ) : !scholarship ? (
          notFound()
        ) : (
          <article>
            <h1 className="detail-title">{scholarship.title}</h1>
            <p className="detail-summary">{scholarship.summary}</p>
            <div className="detail-meta">
              <span className="scholarship-tag">{scholarship.country}</span>
              {scholarship.university ? <span>{scholarship.university}</span> : null}
              {scholarship.degree_level ? <span>{scholarship.degree_level}</span> : null}
              {scholarship.field_of_study ? <span>{scholarship.field_of_study}</span> : null}
              {scholarship.funding_type ? <span>{scholarship.funding_type}</span> : null}
              <span>آخر موعد: {formatDeadline(scholarship.deadline)}</span>
            </div>
            <section className="detail-content">
              <h2>عن المنحة</h2>
              <p>{scholarship.description}</p>
            </section>
            {scholarship.application_url ? (
              <a
                className="button button-secondary"
                href={scholarship.application_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                التقديم على المنحة
              </a>
            ) : null}
          </article>
        )}
      </main>
    </>
  );
}
