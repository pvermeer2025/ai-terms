import Link from "next/link";
import { notFound } from "next/navigation";
import { errorCopy, getCatalog, getTerm } from "@/lib/ai-terms";
import { excerptOf, formatDutchDate, paragraphs } from "@/lib/format";
import type { Term, TermPreview } from "@/lib/normalize";
import { TermCard, type TermCardData } from "./TermCard";

export async function TermArticle({ slug }: { slug: string }) {
  const lookup = await getTerm(slug);
  if (lookup.status === "missing") notFound();
  if (lookup.status === "error") {
    const copy = errorCopy(lookup.error);
    return (
      <div className="at-container">
        <nav className="at-crumb" aria-label="Broodkruimel">
          <Link href="/begrippen">Begrippen</Link>
          <span className="at-sep" aria-hidden="true">
            ›
          </span>
          <span>Begrip</span>
        </nav>
        <h1 className="at-title">Begrip niet geladen</h1>
        <div className="at-notice" role="status">
          <strong>{copy.title}</strong>
          <p>{copy.body}</p>
        </div>
      </div>
    );
  }

  const term = lookup.term;
  const catalog = await getCatalog();
  const related = resolveRelated(term, catalog.ok ? catalog.terms : []);
  const definitionParas = paragraphs(term.definitionNl);
  const box = definitionParas[0] || term.seoNl;
  const whatParas = paragraphs(term.whatIsNl);
  const extraDefinition = whatParas.length === 0 ? definitionParas.slice(1) : [];
  const what = whatParas.length > 0 ? whatParas : extraDefinition;
  const why = paragraphs(term.whyNl);
  const practice = paragraphs(term.practiceNl);
  const updated = formatDutchDate(term.updatedAt);
  const checked = formatDutchDate(term.checkedAt);
  const source = term.source;
  const sourceLabel = source?.name || source?.publisher;

  return (
    <div className="at-container">
      <nav className="at-crumb" aria-label="Broodkruimel">
        <Link href="/begrippen">Begrippen</Link>
        {term.category ? (
          <>
            <span className="at-sep" aria-hidden="true">
              ›
            </span>
            <Link href={`/begrippen/onderwerp/${term.category.slug}`}>{term.category.name}</Link>
          </>
        ) : null}
        <span className="at-sep" aria-hidden="true">
          ›
        </span>
        <span>{term.termNl}</span>
      </nav>
      <h1 className="at-title">{term.termNl}</h1>
      {term.termEn || term.aliases.length > 0 ? (
        <p className="at-en">
          {term.termEn ? (
            <>
              Engels: <strong>{term.termEn}</strong>
            </>
          ) : null}
          {term.aliases.length > 0 ? (
            <>
              {term.termEn ? " · " : null}
              Ook wel: <strong>{term.aliases.join(", ")}</strong>
            </>
          ) : null}
        </p>
      ) : null}

      {box ? (
        <div className="at-def">
          <div className="at-def-label">In het kort</div>
          <p>{box}</p>
        </div>
      ) : null}

      <article className="at-prose">
        {what.length > 0 ? (
          <>
            <h2>Wat is {term.termNl}?</h2>
            {what.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </>
        ) : null}
        {why.length > 0 ? (
          <>
            <h2>Waarom is dit belangrijk?</h2>
            {why.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </>
        ) : null}
        {practice.length > 0 ? (
          <>
            <h2>Zo werkt het in de praktijk</h2>
            {practice.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </>
        ) : null}
      </article>

      {source && sourceLabel ? (
        <p className="at-bron">
          Bron:{" "}
          {source.url ? (
            <a href={source.url} rel="noopener noreferrer" target="_blank">
              {sourceLabel}
            </a>
          ) : (
            sourceLabel
          )}
          {source.publisher && source.name && source.publisher !== source.name
            ? ` · ${source.publisher}`
            : null}
        </p>
      ) : null}

      {updated || checked ? (
        <div className="at-term-meta">
          {updated ? <span>Bijgewerkt op {updated}</span> : null}
          {checked ? <span>Gecontroleerd op {checked}</span> : null}
        </div>
      ) : null}

      {related.length > 0 ? (
        <>
          <h2 className="at-related-title">Gerelateerde begrippen</h2>
          <div className="at-related">
            {related.map((item) => (
              <TermCard key={item.slug} term={item} />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function resolveRelated(term: Term, catalog: Term[]): TermCardData[] {
  const cards: TermCardData[] = [];
  const seen = new Set<string>([term.slug]);
  const push = (card: TermCardData) => {
    if (!card.slug || seen.has(card.slug) || cards.length >= 3) return;
    seen.add(card.slug);
    cards.push(card);
  };

  for (const slug of term.relatedSlugs) {
    const hit = catalog.find((item) => item.slug === slug || item.id === slug);
    if (hit) {
      push(cardFromTerm(hit));
      continue;
    }
    const preview = term.relatedPreviews.find((item) => item.slug === slug);
    if (preview) push(cardFromPreview(preview));
  }
  if (cards.length === 0) {
    for (const preview of term.relatedPreviews) push(cardFromPreview(preview));
  }
  if (cards.length === 0 && term.category) {
    for (const item of catalog) {
      if (item.category?.slug === term.category.slug) push(cardFromTerm(item));
    }
  }
  return cards;
}

function cardFromTerm(term: Term): TermCardData {
  return {
    slug: term.slug,
    termNl: term.termNl,
    termEn: term.termEn,
    excerpt: excerptOf(term.definitionNl, term.seoNl),
    categoryName: term.category?.name ?? null,
  };
}

function cardFromPreview(preview: TermPreview): TermCardData {
  return {
    slug: preview.slug,
    termNl: preview.termNl,
    termEn: preview.termEn,
    excerpt: excerptOf(preview.definitionNl, null),
    categoryName: preview.categoryName,
  };
}
