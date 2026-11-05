import type { Metadata } from "next";
import { GlossaryScreen } from "@/components/GlossaryScreen";

export const metadata: Metadata = {
  title: "Begrippen",
  description: "AI-termen in gewone taal. Zoek een begrip, blader op letter of filter op onderwerp.",
};

export default async function BegrippenPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  return <GlossaryScreen mode="overview" searchParams={query} />;
}
