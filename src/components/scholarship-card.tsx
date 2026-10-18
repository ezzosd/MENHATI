import type { Scholarship } from "@/lib/scholarships";
import { formatDeadline } from "@/lib/scholarships";

export function ScholarshipCard({ scholarship }: { scholarship: Scholarship }) {
  return (
    <article className="scholarship-card">
      <div className="scholarship-meta">
        <span className="scholarship-tag">{scholarship.country}</span>
        {scholarship.degree_level ? <span>{scholarship.degree_level}</span> : null}
      </div>
      <h2>{scholarship.title}</h2>
      <p>{scholarship.summary}</p>
      <div className="scholarship-meta">
        <span>آخر موعد: {formatDeadline(scholarship.deadline)}</span>
      </div>
      <a className="text-link" href={`/scholarships/${encodeURIComponent(scholarship.slug)}`}>
        تفاصيل المنحة
      </a>
    </article>
  );
}
