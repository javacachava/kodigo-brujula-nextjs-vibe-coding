import Link from "next/link";
import { Suspense } from "react";
import { CityCard } from "@/components/city-card";
import { CompassMark } from "@/components/compass-mark";
import { HeroSearch } from "@/components/hero-search";
import { CityCardSkeleton } from "@/components/skeletons";
import { FEATURED } from "@/lib/featured";

const STEPS = [
  {
    title: "Busca un destino",
    text: "Escribe cualquier ciudad del mundo. Los resultados llegan desde la API de geocodificación en tiempo real.",
  },
  {
    title: "Lee el pronóstico",
    text: "Temperatura, lluvia, UV y viento para hoy y los próximos 6 días, en la hora local del destino.",
  },
  {
    title: "Elige el mejor día",
    text: "Cada jornada recibe un puntaje de 0 a 100. Guarda tus favoritos y compáralos en un solo lugar.",
  },
];

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-6 pt-12 sm:px-6 md:grid-cols-[1.25fr_1fr] md:pt-20">
        <div className="rise">
          <p className="eyebrow">Planificador de viajes por clima</p>
          <h1 className="mt-4 font-display text-[2.6rem] font-medium leading-[1.05] tracking-tight text-balance sm:text-6xl">
            Elige el destino por el clima que{" "}
            <em className="font-medium text-accent">lo espera.</em>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-soft text-pretty">
            Brújula compara el pronóstico de 7 días de cualquier ciudad y te
            dice cuál es el mejor momento para salir a pasear.
          </p>
          <div className="mt-8 max-w-xl">
            <HeroSearch />
          </div>
          <p className="mt-4 text-sm text-ink-soft">
            O empieza por{" "}
            <Link href="/explorar" className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4">
              explorar todos los destinos
            </Link>
            .
          </p>
        </div>
        <div className="hidden justify-center text-ink md:flex" aria-hidden="true">
          <CompassMark className="w-full max-w-sm" />
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-4 sm:px-6" aria-labelledby="destacados">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow">Ahora mismo</p>
            <h2 id="destacados" className="mt-1 font-display text-3xl font-medium tracking-tight">
              Destinos destacados
            </h2>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED.map((city) => (
            <Suspense key={city.id} fallback={<CityCardSkeleton />}>
              <CityCard city={city} />
            </Suspense>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl px-4 sm:px-6" aria-labelledby="como">
        <p className="eyebrow">Cómo funciona</p>
        <h2 id="como" className="mt-1 font-display text-3xl font-medium tracking-tight">
          Tres pasos, cero improvisación
        </h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <li key={step.title} className="card p-6">
              <span className="font-display text-4xl font-medium text-accent tabular-nums">
                {i + 1}
              </span>
              <h3 className="mt-2 text-lg font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-ink-soft">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
