import type { Metadata } from "next";
import { GlossaryScreen } from "@/components/GlossaryScreen";

export const metadata: Metadata = {
  title: "Begrippen",
  alternates: { canonical: "/begrippen" },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  return <GlossaryScreen mode="overview" searchParams={query} />;
}
