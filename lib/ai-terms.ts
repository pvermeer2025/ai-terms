import { cache } from "react";
import { letterOf } from "./routes";
import {
  normalizeList,
  normalizeTerm,
  uniqueTerms,
  type Term,
} from "./normalize";

export type ApiError = {
  kind: "access" | "http" | "network" | "bad-json";
  status?: number;
  detail: string;
};

export type Catalog =
  | {
      ok: true;
      terms: Term[];
      total: number | null;
      partial: boolean;
      pagesFetched: number;
    }
  | { ok: false; error: ApiError };

const PAGE_LIMIT = 100;
const MAX_PAGES = 40;

export function apiBase(): string {
  const configured = process.env.AI_TERMS_PUBLIC_API_BASE?.trim();
  return (configured || "https://dashboard.ai-cloudy.org").replace(/\/$/, "");
}

export function apiUrl(path: string): string {
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${apiBase()}${suffix}`;
}

function listUrl(page: number, limit: number): string {
  const url = new URL(apiUrl("/api/public/ai-terms"));
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  return url.toString();
}

async function readApi(url: string): Promise<
  | { ok: true; json: unknown; status: number }
  | { ok: false; error: ApiError }
> {
  try {
    const response = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(15000),
      ...(process.env.NODE_ENV === "development"
        ? { cache: "no-store" as const }
        : { next: { revalidate: 60 } }),
    });
    const type = response.headers.get("content-type") || "";
    const text = await response.text();
    const trimmed = text.trim();
    if (
      type.includes("text/html") ||
      trimmed.startsWith("<!DOCTYPE") ||
      trimmed.startsWith("<html") ||
      text.includes("cloudflareaccess.com") ||
      text.includes("Cloudflare Access")
    ) {
      return {
        ok: false,
        error: {
          kind: "access",
          status: response.status,
          detail: "Cloudflare Access login page",
        },
      };
    }
    if (!response.ok) {
      return {
        ok: false,
        error: {
          kind: "http",
          status: response.status,
          detail: trimmed.slice(0, 180) || response.statusText,
        },
      };
    }
    try {
      return { ok: true, json: trimmed ? JSON.parse(trimmed) : null, status: response.status };
    } catch {
      return {
        ok: false,
        error: { kind: "bad-json", status: response.status, detail: trimmed.slice(0, 180) },
      };
    }
  } catch (error) {
    return {
      ok: false,
      error: {
        kind: "network",
        detail: error instanceof Error ? error.message : "fetch failed",
      },
    };
  }
}

export const getCatalog = cache(async (): Promise<Catalog> => {
  const first = await readApi(listUrl(1, PAGE_LIMIT));
  if (!first.ok) return { ok: false, error: first.error };

  const firstPage = normalizeList(first.json);
  const collected = [...firstPage.terms];
  const seen = new Set(collected.map((term) => term.id || term.slug));
  let pagesFetched = 1;
  let partial = false;
  const reportedTotal = firstPage.total;

  const pageFull = firstPage.terms.length >= PAGE_LIMIT;
  const moreExpected =
    pageFull && (reportedTotal === null || collected.length < reportedTotal);

  if (moreExpected) {
    for (let page = 2; page <= MAX_PAGES; page += 1) {
      const next = await readApi(listUrl(page, PAGE_LIMIT));
      if (!next.ok) {
        partial = true;
        break;
      }
      const normalized = normalizeList(next.json);
      const fresh = normalized.terms.filter((term) => {
        const identity = term.id || term.slug;
        if (seen.has(identity)) return false;
        seen.add(identity);
        return true;
      });
      if (fresh.length === 0) break;
      collected.push(...fresh);
      pagesFetched += 1;
      if (normalized.terms.length < PAGE_LIMIT) break;
      if (reportedTotal !== null && collected.length >= reportedTotal) break;
      if (page === MAX_PAGES) partial = collected.length < (reportedTotal ?? Infinity);
    }
  }

  return {
    ok: true,
    terms: uniqueTerms(collected),
    total: reportedTotal,
    partial,
    pagesFetched,
  };
});

export type TermLookup =
  | { status: "ok"; term: Term }
  | { status: "missing" }
  | { status: "error"; error: ApiError };

export const getTerm = cache(async (slugOrId: string): Promise<TermLookup> => {
  const direct = await readApi(apiUrl(`/api/public/ai-terms/${encodeURIComponent(slugOrId)}`));
  if (direct.ok) {
    const term = normalizeTerm(direct.json);
    if (term && term.published) return { status: "ok", term };
    if (!term) {
      const list = normalizeList(direct.json);
      const found = list.terms.find((item) => item.slug === slugOrId || item.id === slugOrId);
      if (found) return { status: "ok", term: found };
    }
  }

  const catalog = await getCatalog();
  if (catalog.ok) {
    const found = catalog.terms.find((item) => item.slug === slugOrId || item.id === slugOrId);
    if (found) return { status: "ok", term: found };
    if (direct.ok || (direct.ok === false && direct.error.status === 404)) {
      return { status: "missing" };
    }
    return { status: "missing" };
  }

  if (!direct.ok && direct.error.status === 404) return { status: "missing" };
  if (!direct.ok) return { status: "error", error: direct.error };
  return { status: "error", error: catalog.error };
});

export function categoriesFrom(terms: Term[]): { slug: string; name: string }[] {
  const map = new Map<string, string>();
  for (const term of terms) {
    if (!term.category) continue;
    if (!map.has(term.category.slug)) map.set(term.category.slug, term.category.name);
  }
  return [...map.entries()]
    .map(([slug, name]) => ({ slug, name }))
    .sort((a, b) => a.name.localeCompare(b.name, "nl", { sensitivity: "base" }));
}

export function filterTerms(
  terms: Term[],
  options: { letter?: string | null; topics?: string[]; q?: string },
): Term[] {
  const topics = new Set((options.topics ?? []).filter(Boolean));
  const query = options.q?.trim().toLowerCase() ?? "";
  const filtered = terms.filter((term) => {
    if (options.letter && letterOf(term.termNl) !== options.letter) return false;
    if (topics.size > 0 && (!term.category || !topics.has(term.category.slug))) return false;
    if (!query) return true;
    const haystack = [
      term.termNl,
      term.termEn,
      term.definitionNl,
      term.seoNl,
      term.whatIsNl,
      term.whyNl,
      term.practiceNl,
      term.category?.name,
      ...term.aliases,
    ]
      .filter(Boolean)
      .join("\n")
      .toLowerCase();
    return haystack.includes(query);
  });

  if (options.letter || (options.topics && options.topics.length > 0)) {
    filtered.sort((a, b) => a.termNl.localeCompare(b.termNl, "nl", { sensitivity: "base" }));
  }
  return filtered;
}

export function errorCopy(error: ApiError): { title: string; body: string } {
  if (error.kind === "access") {
    return {
      title: "De begrippenlijst is nog niet publiek bereikbaar.",
      body: "De API op dashboard.ai-cloudy.org antwoordt met een Cloudflare Access-login. De pagina staat klaar; termen verschijnen zodra de publieke route leesbaar is.",
    };
  }
  return {
    title: "De begrippenlijst is even niet bereikbaar.",
    body: "De publieke API gaf geen termen terug. Probeer het later opnieuw.",
  };
}
