export type TermSource = {
  name: string | null;
  url: string | null;
  publisher: string | null;
};

export type TermPreview = {
  slug: string;
  termNl: string;
  termEn: string | null;
  definitionNl: string | null;
  categoryName: string | null;
};

export type Term = {
  id: string;
  slug: string;
  published: boolean;
  termNl: string;
  termEn: string | null;
  definitionNl: string | null;
  seoNl: string | null;
  whatIsNl: string | null;
  whyNl: string | null;
  practiceNl: string | null;
  category: { name: string; slug: string } | null;
  aliases: string[];
  source: TermSource | null;
  updatedAt: string | null;
  checkedAt: string | null;
  relatedSlugs: string[];
  relatedPreviews: TermPreview[];
};

export type NormalizedList = {
  terms: Term[];
  total: number | null;
};

const TERM_KEYS = [
  "term_nl",
  "termNl",
  "definition_nl",
  "definitionNl",
  "slug",
  "term_en",
  "termEn",
  "name",
  "title",
] as const;

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function pickString(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return stripHtml(value.trim());
    if (typeof value === "number" && Number.isFinite(value)) return String(value);
  }
  return null;
}

function stripHtml(value: string): string {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function asNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

export function slugifyTerm(input: string): string {
  return input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, " en ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function looksLikeTerm(record: Record<string, unknown>): boolean {
  return TERM_KEYS.some((key) => {
    const value = record[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

function publishedFlag(record: Record<string, unknown>): boolean {
  const value = record.published ?? record.is_published ?? record.isPublished;
  if (value === undefined || value === null) return true;
  if (value === true || value === 1 || value === "1" || value === "true") return true;
  return false;
}

function readAliases(record: Record<string, unknown>): string[] {
  const value =
    record.aliases ??
    record.alias ??
    record.aliases_nl ??
    record.aliasesNl ??
    record.ook_wel ??
    record.also_known_as ??
    record.aka;
  const items: string[] = [];
  const push = (entry: unknown) => {
    if (typeof entry === "string") {
      for (const part of entry.split(/[,;|]/)) {
        const trimmed = stripHtml(part).replace(/^ook wel:\s*/i, "").trim();
        if (trimmed) items.push(trimmed);
      }
      return;
    }
    if (isRecord(entry)) {
      const label = pickString(entry, ["alias", "name", "label", "term", "value"]);
      if (label) items.push(label);
    }
  };
  if (Array.isArray(value)) value.forEach(push);
  else push(value);
  return [...new Set(items)];
}

function readCategory(record: Record<string, unknown>): { name: string; slug: string } | null {
  const value =
    record.category ??
    record.category_nl ??
    record.categoryNl ??
    record.onderwerp ??
    record.topic ??
    record.topic_nl;
  if (typeof value === "string" && value.trim()) {
    const name = stripHtml(value.trim());
    const slug = slugifyTerm(name);
    return slug ? { name, slug } : null;
  }
  if (!isRecord(value)) return null;
  const name = pickString(value, [
    "name_nl",
    "nameNl",
    "label_nl",
    "title_nl",
    "name",
    "label",
    "title",
  ]);
  if (!name) return null;
  const explicit = pickString(value, ["slug", "slug_nl", "code"]);
  const slug = explicit && slugifyTerm(explicit) ? slugifyTerm(explicit) : slugifyTerm(name);
  return slug ? { name, slug } : null;
}

function readSource(record: Record<string, unknown>): TermSource | null {
  const embedded = record.source ?? record.bron ?? record.origin ?? record.sources;
  let obj: Record<string, unknown> | null = null;
  if (Array.isArray(embedded)) {
    obj = embedded.find(isRecord) ?? null;
  } else if (isRecord(embedded)) {
    obj = embedded;
  }
  const name = obj
    ? pickString(obj, ["name", "title", "label", "name_nl", "nameNl"])
    : pickString(record, ["source_name", "bron_naam", "sourceName"]);
  const url = obj
    ? pickString(obj, ["url", "href", "link", "website"])
    : pickString(record, ["source_url", "bron_url", "sourceUrl"]);
  const publisher = obj
    ? pickString(obj, ["publisher", "publisher_name", "org", "organisation", "organization"])
    : pickString(record, ["source_publisher", "publisher", "publisher_name"]);
  if (!name && !url && !publisher) return null;
  return { name, url, publisher };
}

function readDate(record: Record<string, unknown>, keys: string[]): string | null {
  return pickString(record, keys);
}

function previewFrom(term: Term): TermPreview {
  return {
    slug: term.slug,
    termNl: term.termNl,
    termEn: term.termEn,
    definitionNl: term.definitionNl,
    categoryName: term.category?.name ?? null,
  };
}

export function normalizeTerm(input: unknown, depth = 0): Term | null {
  const record = unwrapTerm(input);
  if (!record) return null;

  const termNl =
    pickString(record, ["term_nl", "termNl", "title_nl", "titleNl", "name_nl", "nameNl"]) ??
    pickString(record, ["name", "title", "term"]);
  const explicitSlug = pickString(record, ["slug", "slug_nl", "slugNl"]);
  const slugSource = explicitSlug || termNl;
  if (!slugSource) return null;
  const slug =
    explicitSlug && /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(explicitSlug)
      ? explicitSlug.toLowerCase()
      : slugifyTerm(slugSource);
  if (!slug) return null;

  const id =
    pickString(record, ["uuid", "id", "term_id", "termId"]) ?? slug;
  const termEn = pickString(record, [
    "term_en",
    "termEn",
    "title_en",
    "titleEn",
    "name_en",
    "nameEn",
    "english",
    "term_english",
  ]);

  const relatedSlugs: string[] = [];
  const relatedPreviews: TermPreview[] = [];
  if (depth === 0) {
    const related =
      record.related ??
      record.related_terms ??
      record.relatedTerms ??
      record.see_also ??
      record.seeAlso;
    const entries = Array.isArray(related) ? related : related ? [related] : [];
    for (const entry of entries) {
      if (typeof entry === "string" && entry.trim()) {
        relatedSlugs.push(entry.trim());
        continue;
      }
      const nested = normalizeTerm(entry, depth + 1);
      if (!nested) continue;
      relatedSlugs.push(nested.slug);
      relatedPreviews.push(previewFrom(nested));
    }
  }

  return {
    id,
    slug,
    published: publishedFlag(record),
    termNl: termNl || slug,
    termEn,
    definitionNl: pickString(record, [
      "definition_nl",
      "definitionNl",
      "short_definition_nl",
      "summary_nl",
      "definition",
      "summary",
    ]),
    seoNl: pickString(record, [
      "seo_nl",
      "seoNl",
      "meta_description_nl",
      "metaDescriptionNl",
      "meta_description",
    ]),
    whatIsNl: pickString(record, [
      "what_is_nl",
      "whatIsNl",
      "explanation_nl",
      "explanationNl",
      "uitleg_nl",
      "body_nl",
      "long_definition_nl",
    ]),
    whyNl: pickString(record, [
      "why_important_nl",
      "whyImportantNl",
      "why_nl",
      "importance_nl",
      "waarom_nl",
    ]),
    practiceNl: pickString(record, [
      "in_practice_nl",
      "inPracticeNl",
      "practice_nl",
      "praktijk_nl",
    ]),
    category: readCategory(record),
    aliases: readAliases(record),
    source: readSource(record),
    updatedAt: readDate(record, [
      "updated_at",
      "updatedAt",
      "bijgewerkt_op",
      "modified_at",
      "content_updated_at",
    ]),
    checkedAt: readDate(record, [
      "checked_at",
      "reviewed_at",
      "gecontroleerd_op",
      "checkedAt",
      "verified_at",
      "reviewedAt",
    ]),
    relatedSlugs,
    relatedPreviews,
  };
}

function unwrapTerm(input: unknown, depth = 0): Record<string, unknown> | null {
  if (!isRecord(input) || depth > 3) return null;
  for (const key of ["data", "term", "item", "result", "ai_term", "aiTerm"]) {
    const value = input[key];
    if (!isRecord(value)) continue;
    const inner = unwrapTerm(value, depth + 1);
    if (inner && looksLikeTerm(inner)) return inner;
  }
  if (looksLikeTerm(input)) return input;
  return null;
}

function absorbMeta(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const key of ["meta", "pagination", "pageInfo", "page_info"]) {
    if (isRecord(source[key])) Object.assign(target, source[key]);
  }
  for (const key of [
    "total",
    "totalCount",
    "total_count",
    "totalItems",
    "total_items",
    "page",
    "limit",
    "pages",
    "has_more",
    "hasMore",
  ]) {
    if (source[key] !== undefined && target[key] === undefined) target[key] = source[key];
  }
}

const LIST_KEYS = [
  "data",
  "items",
  "results",
  "terms",
  "records",
  "rows",
  "ai_terms",
  "aiTerms",
  "entries",
] as const;

export function extractList(input: unknown, depth = 0): { items: unknown[]; meta: Record<string, unknown> } {
  if (Array.isArray(input)) return { items: input, meta: {} };
  if (!isRecord(input) || depth > 3) return { items: [], meta: {} };
  const meta: Record<string, unknown> = {};
  absorbMeta(meta, input);
  for (const key of LIST_KEYS) {
    const value = input[key];
    if (Array.isArray(value)) return { items: value, meta };
    if (isRecord(value)) {
      const nested = extractList(value, depth + 1);
      absorbMeta(meta, nested.meta);
      if (nested.items.length > 0 || LIST_KEYS.some((inner) => Array.isArray(value[inner]))) {
        return { items: nested.items, meta };
      }
    }
  }
  return { items: [], meta };
}

export function listTotal(meta: Record<string, unknown>): number | null {
  return (
    asNumber(meta.total) ??
    asNumber(meta.totalCount) ??
    asNumber(meta.total_count) ??
    asNumber(meta.totalItems) ??
    asNumber(meta.total_items)
  );
}

export function normalizeList(input: unknown): NormalizedList {
  const { items, meta } = extractList(input);
  const terms = items
    .map((item) => normalizeTerm(item))
    .filter((term): term is Term => !!term && term.published);
  return { terms, total: listTotal(meta) };
}

export function uniqueTerms(terms: Term[]): Term[] {
  const seen = new Set<string>();
  const slugs = new Map<string, number>();
  const unique: Term[] = [];
  for (const term of terms) {
    const identity = term.id || term.slug;
    if (seen.has(identity)) continue;
    seen.add(identity);
    const count = slugs.get(term.slug) ?? 0;
    slugs.set(term.slug, count + 1);
    unique.push(count === 0 ? term : { ...term, slug: `${term.slug}-${count + 1}` });
  }
  return unique;
}
