import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GlossaryScreen } from "@/components/GlossaryScreen";
import { parseLetterSegment } from "@/lib/routes";

type Params = { letter: string };
type Query = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { letter: segment } = await params;
  const letter = parseLetterSegment(segment);
  if (!letter) return { title: "Letter" };
  const title = letter === "#" ? "Begrippen met een cijfer of teken" : `Begrippen met de ${letter}`;
  return {
    title,
    description:
      letter === "#"
        ? "Alle AI-termen die niet met een letter beginnen, in gewone taal."
        : `Alle AI-termen die beginnen met de letter ${letter}, in gewone taal.`,
  };
}

export default async function LetterPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Query>;
}) {
  const [{ letter: segment }, query] = await Promise.all([params, searchParams]);
  const letter = parseLetterSegment(segment);
  if (!letter) notFound();
  return <GlossaryScreen mode="letter" letter={letter} searchParams={query} />;
}
