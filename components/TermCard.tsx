import Link from "next/link";

export type TermCardData = {
  slug: string;
  termNl: string;
  termEn: string | null;
  excerpt: string | null;
  categoryName: string | null;
};

export function TermCard({ term }: { term: TermCardData }) {
  return (
    <Link className="at-card" href={`/begrippen/${term.slug}`}>
      {term.categoryName ? <div className="at-cat">{term.categoryName}</div> : null}
      <div className="at-card-title">{term.termNl}</div>
      {term.termEn ? <div className="at-card-en">{term.termEn}</div> : null}
      {term.excerpt ? <div className="at-card-def">{term.excerpt}</div> : null}
    </Link>
  );
}
