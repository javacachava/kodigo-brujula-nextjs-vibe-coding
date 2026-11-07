import { isStorm } from "./weather-codes";
import type { DayForecast } from "./types";

export type ScoreTier = "ideal" | "great" | "ok" | "poor";

export type TravelScore = {
  /** 0 a 100 */
  value: number;
  tier: ScoreTier;
  label: string;
};

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));

/**
 * Puntaje de "que tan buen dia es para salir a pasear" (0-100).
 *  - 40% temperatura maxima (ideal entre 21 y 28 C)
 *  - 45% probabilidad de lluvia
 *  - 15% indice UV (molesto por encima de 7)
 *  - Las tormentas restan 20 puntos extra.
 */
export function scoreDay(day: DayForecast): TravelScore {
  const distanceFromIdeal =
    day.tempMax < 21 ? 21 - day.tempMax : day.tempMax > 28 ? day.tempMax - 28 : 0;
  const temp = clamp(100 - distanceFromIdeal * 6, 0, 100);
  const rain = clamp(100 - day.precipitationProbability, 0, 100);
  const uv = clamp(100 - Math.max(0, day.uvIndex - 7) * 12, 0, 100);

  let value = 0.4 * temp + 0.45 * rain + 0.15 * uv;
  if (isStorm(day.weatherCode)) value -= 20;
  value = Math.round(clamp(value, 0, 100));

  return { value, ...tierFor(value) };
}

function tierFor(value: number): Pick<TravelScore, "tier" | "label"> {
  if (value >= 80) return { tier: "ideal", label: "Ideal" };
  if (value >= 65) return { tier: "great", label: "Muy bueno" };
  if (value >= 45) return { tier: "ok", label: "Aceptable" };
  return { tier: "poor", label: "Mejor evitar" };
}

/** Devuelve el mejor dia de la semana (el primero en caso de empate). */
export function bestDay(days: DayForecast[]) {
  return days.reduce(
    (best, day) => {
      const score = scoreDay(day);
      return score.value > best.score.value ? { day, score } : best;
    },
    { day: days[0], score: scoreDay(days[0]) },
  );
}

/** Promedio del puntaje de todos los dias del pronostico. */
export function weekScore(days: DayForecast[]): TravelScore {
  const avg = Math.round(
    days.reduce((sum, d) => sum + scoreDay(d).value, 0) / days.length,
  );
  return { value: avg, ...tierFor(avg) };
}
