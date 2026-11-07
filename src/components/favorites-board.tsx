"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { degrees, flagOf } from "@/lib/format";
import type { ApiError, FavoriteCity, Forecast } from "@/lib/types";
import { useFavorites } from "@/lib/use-favorites";
import { weekScore, type TravelScore } from "@/lib/travel-score";
import { describeWeather } from "@/lib/weather-codes";
import { ScoreBadge } from "./score-badge";
import { WeatherIcon } from "./weather-icon";

type CardState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; forecast: Forecast };

function FavoriteCard({
  city,
  onScore,
  onRemove,
}: {
  city: FavoriteCity;
  onScore: (id: number, score: TravelScore | null) => void;
  onRemove: () => void;
}) {
  const [state, setState] = useState<CardState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    const url = `/api/clima?lat=${city.latitude}&lon=${city.longitude}`;

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        const body: Forecast | ApiError = await res.json();
        if ("error" in body) throw new Error(body.error);
        setState({ status: "ready", forecast: body });
        onScore(city.id, weekScore(body.daily));
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setState({
          status: "error",
          message: error instanceof Error ? error.message : "Error desconocido",
        });
        onScore(city.id, null);
      });

    return () => controller.abort();
  }, [city.id, city.latitude, city.longitude, attempt, onScore]);

  function retry() {
    setState({ status: "loading" });
    setAttempt((n) => n + 1);
  }

  return (
    <article className="card flex flex-col gap-3 p-5">
      <header className="flex items-start justify-between gap-3">
        <Link href={`/ciudad/${city.id}`} className="min-w-0 rounded-md hover:underline">
          <h3 className="truncate font-display text-xl font-semibold leading-tight">
            {city.name}
          </h3>
          <p className="truncate text-sm text-ink-soft">
            <span aria-hidden="true">{flagOf(city.countryCode)}</span> {city.country}
          </p>
        </Link>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Quitar ${city.name} de favoritos`}
          className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-soft hover:border-tier-poor hover:text-tier-poor"
        >
          Quitar
        </button>
      </header>

      {state.status === "loading" && (
        <div role="status" aria-label={`Cargando ${city.name}`} className="space-y-3">
          <div className="skeleton h-12 w-1/2" />
          <div className="skeleton h-5 w-3/4" />
        </div>
      )}

      {state.status === "error" && (
        <div role="alert" className="rounded-xl border border-tier-poor/40 p-3 text-sm">
          <p className="text-tier-poor">{state.message}</p>
          <button type="button" onClick={retry} className="mt-2 font-semibold underline underline-offset-4">
            Reintentar
          </button>
        </div>
      )}

      {state.status === "ready" && (() => {
        const { current, daily } = state.forecast;
        const { label, kind } = describeWeather(current.weatherCode, current.isDay);
        return (
          <>
            <div className="flex items-center justify-between">
              <p className="font-display text-5xl font-medium tabular-nums tracking-tight">
                {degrees(current.temperature)}
              </p>
              <WeatherIcon kind={kind} className="size-10 text-sea" title={label} />
            </div>
            <p className="text-sm text-ink-soft">
              {label} · máx {degrees(daily[0].tempMax)} / mín {degrees(daily[0].tempMin)}
            </p>
            <div className="flex items-center justify-between border-t border-line pt-3">
              <span className="text-xs text-ink-soft">Puntaje de la semana</span>
              <ScoreBadge score={weekScore(daily)} />
            </div>
          </>
        );
      })()}
    </article>
  );
}

/** Lista de favoritos (localStorage) con el clima de cada ciudad en vivo. */
export function FavoritesBoard() {
  const { favorites, ready, toggle } = useFavorites();
  const [scores, setScores] = useState<Record<number, TravelScore | null>>({});

  const onScore = useCallback((id: number, score: TravelScore | null) => {
    setScores((prev) => ({ ...prev, [id]: score }));
  }, []);

  if (!ready) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="status" aria-label="Cargando favoritos">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card space-y-3 p-5">
            <div className="skeleton h-5 w-1/2" />
            <div className="skeleton h-12 w-1/3" />
            <div className="skeleton h-5 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="card mx-auto max-w-xl p-10 text-center">
        <p className="font-display text-2xl">Aún no tienes destinos guardados</p>
        <p className="mt-2 text-ink-soft">
          Toca el corazón en cualquier ciudad para compararla aquí con las demás.
        </p>
        <Link href="/explorar" className="btn-primary mt-6">
          Explorar destinos
        </Link>
      </div>
    );
  }

  const ranked = favorites
    .map((f) => ({ city: f, score: scores[f.id] }))
    .filter((r): r is { city: FavoriteCity; score: TravelScore } => !!r.score)
    .sort((a, b) => b.score.value - a.score.value);
  const top = ranked[0];

  return (
    <div>
      {top && ranked.length > 1 && (
        <p className="mb-6 rounded-2xl bg-ink px-5 py-4 text-paper" aria-live="polite">
          Mejor opción esta semana:{" "}
          <Link href={`/ciudad/${top.city.id}`} className="font-display text-lg font-semibold underline underline-offset-4">
            {top.city.name}
          </Link>{" "}
          con {top.score.value}/100 ({top.score.label.toLowerCase()}).
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {favorites.map((city) => (
          <FavoriteCard
            key={city.id}
            city={city}
            onScore={onScore}
            onRemove={() => toggle(city)}
          />
        ))}
      </div>
    </div>
  );
}
