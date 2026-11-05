export const PAGE_SIZE = 9;

export const FALLBACK_TOPICS: { slug: string; name: string }[] = [
  { slug: "basisbegrippen", name: "Basisbegrippen" },
  { slug: "taalmodellen", name: "Taalmodellen" },
  { slug: "machine-learning", name: "Machine learning" },
  { slug: "ethiek-en-regelgeving", name: "Ethiek en regelgeving" },
  { slug: "data", name: "Data" },
  { slug: "neurale-netwerken", name: "Neurale netwerken" },
  { slug: "robotica-en-agents", name: "Robotica en agents" },
  { slug: "infrastructuur", name: "Infrastructuur" },
  { slug: "generatieve-ai", name: "Generatieve AI" },
  { slug: "beeld-en-spraak", name: "Beeld en spraak" },
  { slug: "kennis-en-redeneren", name: "Kennis en redeneren" },
];

export const LETTERS = [
  "#",
  ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
] as const;

export type ViewMode = "grid" | "list";

export function slugify(input: string): string {
  const slug = input
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/&/g, " en ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug;
}

export function letterOf(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) return "#";
  const ch = trimmed[0]!.normalize("NFD").replace(/\p{M}/gu, "").toUpperCase();
  if (ch >= "A" && ch <= "Z") return ch;
  return "#";
}

export function letterSegment(letter: string): string {
  return letter === "#" ? "hash" : letter.toLowerCase();
}

export function parseLetterSegment(segment: string): string | null {
  const value = decodeURIComponent(segment).trim().toLowerCase();
  if (value === "hash" || value === "#" || value === "nummer") return "#";
  if (/^[a-z]$/.test(value)) return value.toUpperCase();
  return null;
}

export function listingHref(options: {
  letter?: string | null;
  topics?: string[];
  q?: string;
  view?: ViewMode;
  page?: number;
}): string {
  const topics = (options.topics ?? []).filter(Boolean);
  const params = new URLSearchParams();
  const q = options.q?.trim();
  if (q) params.set("q", q);
  if (options.view === "list") params.set("view", "list");
  if (options.page && options.page > 1) params.set("page", String(options.page));

  let path = "/begrippen";
  if (options.letter) {
    path = `/begrippen/letter/${letterSegment(options.letter)}`;
    for (const topic of topics) params.append("topic", topic);
  } else if (topics.length === 1) {
    path = `/begrippen/onderwerp/${encodeURIComponent(topics[0]!)}`;
  } else {
    for (const topic of topics) params.append("topic", topic);
  }

  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function parseView(value: string | string[] | undefined): ViewMode {
  const raw = Array.isArray(value) ? value[0] : value;
  return raw === "list" ? "list" : "grid";
}

export function parsePage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number(raw);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.floor(page);
}

export function parseTopics(value: string | string[] | undefined): string[] {
  const list = Array.isArray(value) ? value : value ? [value] : [];
  const seen = new Set<string>();
  const topics: string[] = [];
  for (const item of list) {
    const slug = item.trim().toLowerCase();
    if (!slug || seen.has(slug)) continue;
    seen.add(slug);
    topics.push(slug);
  }
  return topics;
}

export function pageWindow(current: number, total: number): Array<number | "gap"> {
  if (total <= 1) return [1];
  const wanted = new Set<number>([1, total, current, current - 1, current + 1]);
  if (current <= 3) {
    wanted.add(2);
    wanted.add(3);
  }
  if (current >= total - 2) {
    wanted.add(total - 1);
    wanted.add(total - 2);
  }
  const pages = [...wanted].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: Array<number | "gap"> = [];
  let prev = 0;
  for (const page of pages) {
    if (prev && page - prev > 1) out.push("gap");
    out.push(page);
    prev = page;
  }
  return out;
}
