import Link from "next/link";
import {
  categoriesFrom,
  errorCopy,
  filterTerms,
  getCatalog,
  type ApiError,
} from "@/lib/ai-terms";
import { excerptOf } from "@/lib/format";
import {
  FALLBACK_TOPICS,
  LETTERS,
  PAGE_SIZE,
  letterOf,
  letterSegment,
  listingHref,
  parsePage,
  parseTopics,
  parseView,
  type ViewMode,
} from "@/lib/routes";
import type { Term } from "@/lib/normalize";
import { FilterShell } from "./FilterShell";
import { IconGrid, IconList, IconSearch } from "./Icons";
import { Pagination } from "./Pagination";
import { TermCard } from "./TermCard";

export async function GlossaryScreen({
  mode,
  letter,
  categorySlug,
  searchParams,
}: {
  mode: "overview" | "letter" | "category";
  letter?: string | null;
  categorySlug?: string | null;
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const catalog = await getCatalog();
  const q = (Array.isArray(searchParams.q) ? searchParams.q[0] : searchParams.q)?.trim() ?? "";
  const view = parseView(searchParams.view);
  const requestedPage = parsePage(searchParams.page);
  const queryTopics = parseTopics(searchParams.topic);
  const selected = [
    ...new Set([...(categorySlug ? [categorySlug] : []), ...queryTopics]),
  ];

  const terms = catalog.ok ? catalog.terms : [];
  const liveTopics = categoriesFrom(terms);
  const topics = liveTopics.length > 0 ? liveTopics : catalog.ok ? [] : FALLBACK_TOPICS;
  const topicName =
    topics.find((topic) => topic.slug === categorySlug)?.name ??
    liveTopics.find((topic) => topic.slug === categorySlug)?.name ??
    (categorySlug ? categorySlug.replace(/-/g, " ") : "");

  const filtered = catalog.ok
    ? filterTerms(terms, { letter: letter ?? null, topics: selected, q })
    : [];
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(requestedPage, pages);
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const activeLetters = new Set(terms.map((term) => letterOf(term.termNl)));
  const knowLetters = catalog.ok && terms.length > 0;

  const hrefFor = (nextPage: number, nextView: ViewMode = view) =>
    listingHref({
      letter: letter ?? null,
      topics: selected,
      q,
      view: nextView,
      page: nextPage,
    });

  const searchAction =
    mode === "letter" && letter
      ? `/begrippen/letter/${letterSegment(letter)}`
      : mode === "category" && categorySlug
        ? `/begrippen/onderwerp/${encodeURIComponent(categorySlug)}`
        : "/begrippen";

  const hiddenTopics = mode === "category" ? queryTopics : selected;

  return (
    <div className="at-container">
      {mode === "letter" && letter ? (
        <nav className="at-crumb" aria-label="Broodkruimel">
          <Link href="/begrippen">Begrippen</Link>
          <span className="at-sep" aria-hidden="true">
            ›
          </span>
          <span>{letter === "#" ? "Cijfer of teken" : `Letter ${letter}`}</span>
        </nav>
      ) : null}
      {mode === "category" && categorySlug ? (
        <nav className="at-crumb" aria-label="Broodkruimel">
          <Link href="/begrippen">Begrippen</Link>
          <span className="at-sep" aria-hidden="true">
            ›
          </span>
          <span>{topicName}</span>
        </nav>
      ) : null}
      {mode === "overview" ? <p className="at-kicker">AI Glossary</p> : null}
      <h1 className="at-title">
        {mode === "letter" && letter
          ? letter === "#"
            ? "Begrippen met een cijfer of teken"
            : "Begrippen met de "
          : mode === "category"
            ? topicName
            : "Begrippen"}
        {mode === "letter" && letter && letter !== "#" ? letter : null}
        {mode !== "overview" ? <span className="at-count"> ({filtered.length})</span> : null}
      </h1>
      <p className="at-intro">
        {mode === "letter" && letter
          ? letter === "#"
            ? "Alle AI-termen die niet met een letter beginnen, in gewone taal."
            : `Alle AI-termen die beginnen met de letter ${letter}, in gewone taal.`
          : mode === "category"
            ? `Alle AI-termen binnen ${topicName}, in gewone taal.`
            : "AI-termen in gewone taal. Zoek een begrip, blader op letter of filter op onderwerp."}
      </p>

      <FilterShell
        filters={
          <aside className="at-aside" id="filters" aria-label="Filters">
            <h2 className="at-filter-title">Filters</h2>
            <form className="at-search" action={searchAction} method="get" role="search">
              {hiddenTopics.map((topic) => (
                <input key={topic} type="hidden" name="topic" value={topic} />
              ))}
              {view === "list" ? <input type="hidden" name="view" value="list" /> : null}
              <IconSearch />
              <input
                type="search"
                name="q"
                placeholder="Zoeken…"
                aria-label="Zoeken"
                defaultValue={q}
              />
            </form>
            <div className="at-filter-section">
              <div className="at-filter-label">A–Z</div>
              <div className="at-az" aria-label="Letters">
                {LETTERS.map((key) => {
                  const disabled = knowLetters && !activeLetters.has(key);
                  const active = letter === key;
                  if (disabled) {
                    return (
                      <span key={key} className="is-disabled" aria-disabled="true">
                        {key}
                      </span>
                    );
                  }
                  return (
                    <Link
                      key={key}
                      href={listingHref({ letter: key, topics: selected, q, view })}
                      className={active ? "is-active" : undefined}
                      aria-current={active ? "page" : undefined}
                    >
                      {key}
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="at-filter-section">
              <div className="at-filter-label">Onderwerpen</div>
              {topics.length === 0 ? (
                <p className="at-topic-empty">Nog geen onderwerpen.</p>
              ) : (
                <div className="at-topics">
                  {topics.map((topic) => {
                    const checked = selected.includes(topic.slug);
                    const next = checked
                      ? selected.filter((slug) => slug !== topic.slug)
                      : [...selected, topic.slug];
                    return (
                      <Link
                        key={topic.slug}
                        href={listingHref({ letter: letter ?? null, topics: next, q, view })}
                        className="at-topic"
                        role="checkbox"
                        aria-checked={checked}
                      >
                        <span className={checked ? "at-box is-on" : "at-box"} aria-hidden="true" />
                        <span>{topic.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </aside>
        }
      >
        {!catalog.ok ? <ApiNotice error={catalog.error} /> : null}
        {catalog.ok && catalog.partial ? (
          <div className="at-notice" role="status">
            <strong>Niet alle termen zijn geladen.</strong>
            <p>De lijst is gefilterd op de pagina’s die de API wel teruggaf.</p>
          </div>
        ) : null}
        <div className="at-toolbar">
          <div className="at-count-line">Showing {filtered.length} results</div>
          <div className="at-toolbar-right">
            <div className="at-mini" aria-label="Pagina">
              {page > 1 ? (
                <Link href={hrefFor(page - 1)} aria-label="Vorige">
                  ‹
                </Link>
              ) : (
                <span aria-disabled="true">‹</span>
              )}
              <span className="at-mini-current">{page}</span>
              {page < pages ? (
                <Link href={hrefFor(page + 1)} aria-label="Volgende">
                  ›
                </Link>
              ) : (
                <span aria-disabled="true">›</span>
              )}
            </div>
            <div className="at-view" role="group" aria-label="Weergave">
              <Link
                href={hrefFor(page, "grid")}
                className={view === "grid" ? "is-active" : undefined}
                aria-label="Raster"
                title="Raster"
                aria-pressed={view === "grid"}
              >
                <IconGrid />
              </Link>
              <Link
                href={hrefFor(page, "list")}
                className={view === "list" ? "is-active" : undefined}
                aria-label="Lijst"
                title="Lijst"
                aria-pressed={view === "list"}
              >
                <IconList />
              </Link>
            </div>
          </div>
        </div>
        {slice.length > 0 ? (
          <div className={view === "list" ? "at-cards is-list" : "at-cards"}>
            {slice.map((term) => (
              <TermCard key={term.slug} term={toCard(term)} />
            ))}
          </div>
        ) : catalog.ok ? (
          <p className="at-empty">Geen begrippen gevonden.</p>
        ) : null}
        <Pagination page={page} pages={pages} hrefFor={(next) => hrefFor(next)} />
      </FilterShell>
    </div>
  );
}

function toCard(term: Term) {
  return {
    slug: term.slug,
    termNl: term.termNl,
    termEn: term.termEn,
    excerpt: excerptOf(term.definitionNl, term.seoNl),
    categoryName: term.category?.name ?? null,
  };
}

function ApiNotice({ error }: { error: ApiError }) {
  const copy = errorCopy(error);
  return (
    <div className="at-notice" role="status">
      <strong>{copy.title}</strong>
      <p>{copy.body}</p>
    </div>
  );
}
