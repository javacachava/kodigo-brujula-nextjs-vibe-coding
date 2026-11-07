import Link from "next/link";
import { degrees, flagOf } from "@/lib/format";
import { getForecast } from "@/lib/open-meteo";
import { weekScore } from "@/lib/travel-score";
import { describeWeather } from "@/lib/weather-codes";
import type { FavoriteCity } from "@/lib/types";
import { ScoreBadge } from "./score-badge";
import { WeatherIcon } from "./weather-icon";

/** Tarjeta de destino (Server Component async): resuelve su propio pronostico. */
export async function CityCard({ city }: { city: FavoriteCity }) {
  const forecast = await getForecast(city.latitude, city.longitude);
  const { current, daily } = forecast;
  const { label, kind } = describeWeather(current.weatherCode, current.isDay);
  const today = daily[0];

  return (
    <Link
      href={`/ciudad/${city.id}`}
      className="card group flex flex-col gap-3 p-5 transition-all hover:-translate-y-0.5 hover:border-ink-soft hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-xl font-semibold leading-tight">
            {city.name}
          </h3>
          <p className="text-sm text-ink-soft">
            <span aria-hidden="true">{flagOf(city.countryCode)}</span> {city.country}
          </p>
        </div>
        <WeatherIcon kind={kind} className="size-10 text-sea" title={label} />
      </div>
      <p className="font-display text-5xl font-medium tabular-nums tracking-tight">
        {degrees(current.temperature)}
        <span className="font-sans text-base font-normal text-ink-soft">C</span>
      </p>
      <p className="-mt-1 text-sm text-ink-soft">
        {label} · máx {degrees(today.tempMax)} / mín {degrees(today.tempMin)}
      </p>
      <div className="mt-1 flex items-center justify-between gap-2 border-t border-line pt-3">
        <span className="text-xs text-ink-soft">Semana</span>
        <ScoreBadge score={weekScore(daily)} />
      </div>
    </Link>
  );
}
