import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FavoriteButton } from "@/components/favorite-button";
import { ForecastStrip } from "@/components/forecast-strip";
import { WeatherIcon } from "@/components/weather-icon";
import { degrees, flagOf, formatNumber, longDay, timeOf } from "@/lib/format";
import { getCityById, getForecast } from "@/lib/open-meteo";
import { bestDay, weekScore } from "@/lib/travel-score";
import { describeWeather } from "@/lib/weather-codes";

function parseId(raw: string) {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function generateMetadata({
  params,
}: PageProps<"/ciudad/[id]">): Promise<Metadata> {
  const id = parseId((await params).id);
  const city = id ? await getCityById(id).catch(() => null) : null;
  if (!city) return { title: "Destino no encontrado" };
  return {
    title: `${city.name}, ${city.country}`,
    description: `Pronóstico de 7 días y mejor día para viajar a ${city.name}.`,
  };
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-paper-2 px-4 py-3">
      <dt className="text-xs font-semibold uppercase tracking-wider text-ink-soft">
        {label}
      </dt>
      <dd className="mt-0.5 text-lg font-semibold tabular-nums">{value}</dd>
    </div>
  );
}

export default async function CiudadPage({ params }: PageProps<"/ciudad/[id]">) {
  const id = parseId((await params).id);
  if (!id) notFound();

  const city = await getCityById(id);
  if (!city) notFound();

  const forecast = await getForecast(city.latitude, city.longitude);
  const { current, daily } = forecast;
  const { label, kind } = describeWeather(current.weatherCode, current.isDay);
  const today = daily[0];
  const best = bestDay(daily);
  const week = weekScore(daily);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/explorar"
        className="text-sm font-medium text-ink-soft hover:text-ink"
      >
        ← Volver a explorar
      </Link>

      <header className="mt-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="eyebrow">
            <span aria-hidden="true">{flagOf(city.countryCode)}</span>{" "}
            {[city.admin1, city.country].filter(Boolean).join(" · ")}
          </p>
          <h1 className="mt-2 font-display text-5xl font-medium tracking-tight sm:text-6xl">
            {city.name}
          </h1>
          <p className="mt-2 text-ink-soft">
            Zona horaria {city.timezone}
            {city.elevation !== null && ` · ${formatNumber(Math.round(city.elevation))} m s. n. m.`}
            {city.population ? ` · ${formatNumber(city.population)} habitantes` : ""}
          </p>
        </div>
        <FavoriteButton city={city} variant="full" />
      </header>

      <section
        aria-label="Condiciones actuales"
        className="card mt-8 grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]"
      >
        <div className="flex items-center gap-5">
          <WeatherIcon kind={kind} className="size-20 shrink-0 text-sea" title={label} />
          <div>
            <p className="font-display text-7xl font-medium leading-none tabular-nums tracking-tight">
              {degrees(current.temperature)}
            </p>
            <p className="mt-2 text-lg">{label}</p>
            <p className="text-sm text-ink-soft">
              Sensación térmica {degrees(current.apparentTemperature)}
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <Stat label="Máx / mín hoy" value={`${degrees(today.tempMax)} / ${degrees(today.tempMin)}`} />
          <Stat label="Humedad" value={`${current.humidity}%`} />
          <Stat label="Viento" value={`${Math.round(current.windSpeed)} km/h`} />
          <Stat label="Lluvia hoy" value={`${today.precipitationProbability}%`} />
          <Stat label="Índice UV" value={today.uvIndex.toFixed(1)} />
          <Stat label="Sol" value={`${timeOf(today.sunrise)} – ${timeOf(today.sunset)}`} />
        </dl>
      </section>

      <section
        aria-label="Veredicto de viaje"
        className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-paper sm:p-8"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
            Mejor día para ir
          </p>
          <p className="mt-1 font-display text-2xl font-medium first-letter:uppercase sm:text-3xl">
            {longDay(best.day.date)}
          </p>
          <p className="mt-1 opacity-80">
            {describeWeather(best.day.weatherCode).label} · {degrees(best.day.tempMax)} de máxima ·{" "}
            {best.day.precipitationProbability}% de lluvia
          </p>
        </div>
        <div className="flex flex-col items-start gap-1 sm:items-end">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
            Puntaje de la semana
          </p>
          <p className="font-display text-5xl font-medium leading-none tabular-nums">
            {week.value}
            <span className="text-xl opacity-70">/100</span>
          </p>
          <p className="text-sm opacity-80">{week.label}</p>
        </div>
      </section>

      <section className="mt-10" aria-labelledby="semana">
        <h2 id="semana" className="mb-5 font-display text-3xl font-medium tracking-tight">
          Próximos 7 días
        </h2>
        <ForecastStrip days={daily} />
      </section>
    </div>
  );
}
