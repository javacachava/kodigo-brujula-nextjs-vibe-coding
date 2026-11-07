import type { Metadata } from "next";
import { Suspense } from "react";
import { CitySearch } from "@/components/city-search";

export const metadata: Metadata = {
  title: "Explorar destinos",
  description: "Busca cualquier ciudad del mundo y consulta su pronóstico de 7 días.",
};

async function SearchWithInitialQuery({
  searchParams,
}: {
  searchParams: PageProps<"/explorar">["searchParams"];
}) {
  const { q } = await searchParams;
  const initialQuery = (Array.isArray(q) ? q[0] : q) ?? "";
  return <CitySearch initialQuery={initialQuery.slice(0, 80)} />;
}

export default function ExplorarPage(props: PageProps<"/explorar">) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow">Explorar</p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        ¿Adónde viajamos?
      </h1>
      <p className="mt-3 mb-8 text-lg text-ink-soft">
        Busca una ciudad, abre su pronóstico y guarda tus favoritos con el corazón.
      </p>
      <Suspense fallback={<div className="skeleton h-13 w-full rounded-full" />}>
        <SearchWithInitialQuery searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
