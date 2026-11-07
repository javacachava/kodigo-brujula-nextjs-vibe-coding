"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { flagOf, formatNumber } from "@/lib/format";
import { FEATURED } from "@/lib/featured";
import type { ApiError, City } from "@/lib/types";
import { FavoriteButton } from "./favorite-button";

type Settled =
  | { query: string; status: "success"; results: City[] }
  | { query: string; status: "error"; message: string };

const MIN_CHARS = 2;

/** Buscador con debounce que consulta el Route Handler /api/ciudades. */
export function CitySearch({ initialQuery = "" }: { initialQuery?: string }) {
  const [query, setQuery] = useState(initialQuery);
  const [settled, setSettled] = useState<Settled | null>(null);
  const [attempt, setAttempt] = useState(0);

  const trimmed = query.trim();
  const enabled = trimmed.length >= MIN_CHARS;

  useEffect(() => {
    if (!enabled) return;
    const controller = new AbortController();

    // Debounce: espera 350 ms sin teclear antes de llamar a la API.
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/ciudades?q=${encodeURIComponent(trimmed)}`, {
          signal: controller.signal,
        });
        const body: { results: City[] } | ApiError = await res.json();
        if ("error" in body) throw new Error(body.error);
        setSettled({ query: trimmed, status: "success", results: body.results });
      } catch (error) {
        if (controller.signal.aborted) return;
        setSettled({
          query: trimmed,
          status: "error",
          message:
            error instanceof Error && error.message
              ? error.message
              : "No pudimos completar la búsqueda",
        });
      }
    }, 350);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, enabled, attempt]);

  // Cargando = hay texto valido y todavia no llega la respuesta de ESE texto.
  const loading = enabled && settled?.query !== trimmed;

  function retry() {
    setSettled(null);
    setAttempt((n) => n + 1);
  }

  return (
    <div>
      <form role="search" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="q" className="sr-only">
          Buscar ciudad
        </label>
        <input
          id="q"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca una ciudad: San Salvador, Lima, Roma…"
          autoComplete="off"
          autoFocus={initialQuery === ""}
          className="min-h-13 w-full rounded-full border border-line bg-surface px-6 text-lg text-ink placeholder:text-ink-soft/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </form>

      <div className="mt-6" aria-live="polite">
        {!enabled && (
          <div>
            <p className="text-sm text-ink-soft">
              {trimmed.length === 1
                ? "Escribe al menos 2 letras."
                : "Escribe al menos 2 letras o prueba con un destino popular:"}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {FEATURED.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setQuery(c.name)}
                    className="btn-ghost min-h-10 px-4"
                  >
                    <span aria-hidden="true">{flagOf(c.countryCode)}</span> {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {loading && (
          <ul className="space-y-3" role="status" aria-label="Buscando ciudades">
            {[0, 1, 2].map((i) => (
              <li key={i} className="card flex items-center gap-4 p-4">
                <div className="skeleton size-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="skeleton h-4 w-1/3" />
                  <div className="skeleton h-3 w-1/2" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {enabled && !loading && settled?.status === "error" && (
          <div role="alert" className="card border-tier-poor/50 p-5">
            <p className="font-semibold text-tier-poor">No se pudo buscar</p>
            <p className="mt-1 text-ink-soft">{settled.message}</p>
            <button type="button" onClick={retry} className="btn-ghost mt-4">
              Reintentar
            </button>
          </div>
        )}

        {enabled && !loading && settled?.status === "success" && (
          settled.results.length === 0 ? (
            <div className="card p-6 text-center">
              <p className="font-display text-xl">Sin resultados para “{settled.query}”</p>
              <p className="mt-1 text-ink-soft">
                Revisa la ortografía o prueba con el nombre en inglés.
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {settled.results.map((city) => (
                <li key={city.id} className="card flex items-center gap-3 p-3 pr-4">
                  <Link
                    href={`/ciudad/${city.id}`}
                    className="flex min-w-0 flex-1 items-center gap-4 rounded-xl p-2 hover:bg-paper-2"
                  >
                    <span className="text-3xl" aria-hidden="true">
                      {flagOf(city.countryCode)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-display text-lg font-semibold">
                        {city.name}
                      </span>
                      <span className="block truncate text-sm text-ink-soft">
                        {[city.admin1, city.country].filter(Boolean).join(", ")}
                        {city.population
                          ? ` · ${formatNumber(city.population)} hab.`
                          : ""}
                      </span>
                    </span>
                  </Link>
                  <FavoriteButton city={city} />
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}
