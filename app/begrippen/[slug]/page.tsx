import type { Metadata } from "next";
import { TermArticle } from "@/components/TermArticle";
import { getTerm } from "@/lib/ai-terms";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lookup = await getTerm(decodeURIComponent(slug));
  if (lookup.status !== "ok") {
    return { title: "Begrip" };
  }
  return {
    title: lookup.term.termNl,
    description: lookup.term.seoNl || lookup.term.definitionNl || undefined,
  };
}

export default async function TermPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  return <TermArticle slug={decodeURIComponent(slug)} />;
}
