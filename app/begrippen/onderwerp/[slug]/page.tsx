import type { Metadata } from "next";
import { GlossaryScreen } from "@/components/GlossaryScreen";

type Params = { slug: string };
type Query = Record<string, string | string[] | undefined>;

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = decodeURIComponent(slug).replace(/-/g, " ");
  return {
    title: name,
    description: `Alle AI-termen binnen ${name}, in gewone taal.`,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<Query>;
}) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  return (
    <GlossaryScreen
      mode="category"
      categorySlug={decodeURIComponent(slug).trim().toLowerCase()}
      searchParams={query}
    />
  );
}
