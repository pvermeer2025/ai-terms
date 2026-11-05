import assert from "node:assert/strict";
import test from "node:test";
import { normalizeList, normalizeTerm } from "./normalize";

test("reads a paginated list and keeps published terms", () => {
  const parsed = normalizeList({
    data: [
      {
        uuid: "aad7fe3c-4882-44e4-8a0e-98b4e37c2592",
        slug: "rag",
        published: true,
        term_nl: "Retrieval-augmented generation",
        term_en: "Retrieval-augmented generation",
        definition_nl: "Een aanpak waarbij een taalmodel bronnen ophaalt.",
        why_important_nl: "Antwoorden blijven dichter bij je eigen feiten.",
        in_practice_nl: "Documenten worden als embeddings opgeslagen.",
        seo_nl: "RAG in gewone taal.",
        category: "Taalmodellen",
        aliases: ["RAG"],
        source: { name: "Stanford HAI", url: "https://hai.stanford.edu/", publisher: "Stanford" },
        updated_at: "2026-10-12",
        checked_at: "2026-10-28",
      },
      {
        slug: "hidden",
        published: false,
        term_nl: "Verborgen term",
      },
    ],
    meta: { total: 753, page: 1, limit: 25 },
  });

  assert.equal(parsed.total, 753);
  assert.equal(parsed.terms.length, 1);
  const term = parsed.terms[0]!;
  assert.equal(term.slug, "rag");
  assert.equal(term.id, "aad7fe3c-4882-44e4-8a0e-98b4e37c2592");
  assert.equal(term.category?.slug, "taalmodellen");
  assert.equal(term.category?.name, "Taalmodellen");
  assert.deepEqual(term.aliases, ["RAG"]);
  assert.equal(term.source?.name, "Stanford HAI");
  assert.equal(term.source?.publisher, "Stanford");
  assert.equal(term.whyNl, "Antwoorden blijven dichter bij je eigen feiten.");
  assert.equal(term.practiceNl, "Documenten worden als embeddings opgeslagen.");
});

test("prefers Dutch fields and unwraps a joined term", () => {
  const term = normalizeTerm({
    data: {
      slug: "ai-literacy",
      term_nl: "AI-geletterdheid",
      term_en: "AI literacy",
      name: "AI literacy",
      definition_nl: "Het vermogen om AI te begrijpen.",
      definition: "The ability to understand AI.",
      category: { name_nl: "Ethiek en regelgeving", slug: "ethiek" },
      aliases: "AI literacy, AI-geletterdheid",
      sources: [{ name: "EU", url: "https://example.com/ai-act" }],
      related_terms: [{ slug: "ai-act", term_nl: "AI Act", term_en: "AI Act", category: "Ethiek en regelgeving" }],
    },
  });

  assert.ok(term);
  assert.equal(term?.termNl, "AI-geletterdheid");
  assert.equal(term?.definitionNl, "Het vermogen om AI te begrijpen.");
  assert.equal(term?.category?.slug, "ethiek");
  assert.deepEqual(term?.aliases, ["AI literacy", "AI-geletterdheid"]);
  assert.equal(term?.source?.name, "EU");
  assert.deepEqual(term?.relatedSlugs, ["ai-act"]);
  assert.equal(term?.relatedPreviews[0]?.termNl, "AI Act");
});

test("treats a missing published flag as visible and strips html", () => {
  const term = normalizeTerm({
    slug: "prompt-engineering",
    termNl: "Prompt engineering",
    definition_nl: "<p>Het formuleren van instructies.</p>",
  });
  assert.equal(term?.published, true);
  assert.equal(term?.definitionNl, "Het formuleren van instructies.");
});
