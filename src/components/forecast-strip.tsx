import { degrees, shortDate, weekday } from "@/lib/format";
import { bestDay, scoreDay } from "@/lib/travel-score";
import { describeWeather } from "@/lib/weather-codes";
import type { DayForecast } from "@/lib/types";
import { scoreBarColor } from "./score-badge";
import { WeatherIcon } from "./weather-icon";

/** Tira de 7 dias con icono, temperaturas, lluvia y puntaje de cada jornada. */
export function ForecastStrip({ days }: { days: DayForecast[] }) {
  const best = bestDay(days).day.date;

  return (
    <ol className="-mx-4 flex snap-x scroll-px-4 gap-3 overflow-x-auto px-4 pb-3 pt-3 sm:mx-0 sm:grid sm:grid-cols-4 sm:overflow-visible sm:px-0 lg:grid-cols-7">
      {days.map((day, i) => {
        const score = scoreDay(day);
        const { label, kind } = describeWeather(day.weatherCode);
        const isBest = day.date === best;
        return (
          <li
            key={day.date}
            className={`card relative flex w-32 shrink-0 snap-start flex-col items-center gap-2 p-4 text-center sm:w-auto ${
              isBest ? "border-tier-ideal ring-2 ring-tier-ideal/30" : ""
            }`}
          >
            {isBest && (
              <span className="absolute -top-2.5 rounded-full bg-tier-ideal px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-paper">
                Mejor día
              </span>
            )}
            <p className="text-sm font-semibold capitalize">
              {i === 0 ? "Hoy" : weekday(day.date)}
            </p>
            <p className="-mt-1.5 text-xs text-ink-soft">{shortDate(day.date)}</p>
            <WeatherIcon kind={kind} className="size-9 text-sea" title={label} />
            <p className="min-h-8 text-xs leading-4 text-ink-soft">{label}</p>
            <p className="tabular-nums">
              <span className="text-lg font-semibold">{degrees(day.tempMax)}</span>{" "}
              <span className="text-sm text-ink-soft">{degrees(day.tempMin)}</span>
            </p>
            <p className="text-xs text-ink-soft">
              <span className="tabular-nums">{day.precipitationProbability}%</span> lluvia
            </p>
            <div
              className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-paper-2"
              role="meter"
              aria-label="Puntaje de viaje"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={score.value}
              aria-valuetext={`${score.value} de 100, ${score.label}`}
            >
              <div
                className={`h-full rounded-full ${scoreBarColor(score.tier)}`}
                style={{ width: `${score.value}%` }}
              />
            </div>
            <p className="text-[11px] font-semibold tabular-nums text-ink-soft">
              {score.value} · {score.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
