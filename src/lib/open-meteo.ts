import "server-only";
import { cacheLife } from "next/cache";
import { config } from "./config";
import type { City, Forecast } from "./types";

/** Error de la API externa. Los Route Handlers lo traducen a un 502. */
export class UpstreamError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "UpstreamError";
  }
}

async function getJson<T>(url: URL): Promise<T> {
  if (config.apiKey) url.searchParams.set("apikey", config.apiKey);
  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
  } catch {
    throw new UpstreamError("No se pudo contactar al servicio del clima");
  }
  if (!res.ok) {
    throw new UpstreamError(
      `El servicio del clima respondio ${res.status}`,
      res.status,
    );
  }
  return (await res.json()) as T;
}

type RawCity = {
  id: number;
  name: string;
  country?: string;
  country_code?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  elevation?: number;
  population?: number;
};

function toCity(raw: RawCity): City {
  return {
    id: raw.id,
    name: raw.name,
    country: raw.country ?? "",
    countryCode: raw.country_code ?? "",
    admin1: raw.admin1 ?? null,
    latitude: raw.latitude,
    longitude: raw.longitude,
    timezone: raw.timezone ?? "UTC",
    elevation: raw.elevation ?? null,
    population: raw.population ?? null,
  };
}

/** Busca ciudades por nombre (resultados en espanol). */
export async function searchCities(query: string): Promise<City[]> {
  "use cache";
  cacheLife("hours");

  const url = new URL(`${config.geocodingUrl}/search`);
  url.searchParams.set("name", query);
  url.searchParams.set("count", "8");
  url.searchParams.set("language", "es");
  url.searchParams.set("format", "json");

  const data = await getJson<{ results?: RawCity[] }>(url);
  return (data.results ?? []).map(toCity);
}

/** Obtiene una ciudad por su id de GeoNames. Devuelve null si no existe. */
export async function getCityById(id: number): Promise<City | null> {
  "use cache";
  cacheLife("days");

  const url = new URL(`${config.geocodingUrl}/get`);
  url.searchParams.set("id", String(id));
  url.searchParams.set("language", "es");

  try {
    return toCity(await getJson<RawCity>(url));
  } catch (error) {
    // La API responde 404 cuando el id no existe: no es una falla del servicio.
    if (error instanceof UpstreamError && error.status === 404) return null;
    throw error;
  }
}

type RawForecast = {
  timezone: string;
  current: {
    temperature_2m: number;
    apparent_temperature: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
    is_day: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
    uv_index_max: (number | null)[];
    sunrise: string[];
    sunset: string[];
  };
};

/** Pronostico actual + 7 dias para unas coordenadas. */
export async function getForecast(
  latitude: number,
  longitude: number,
): Promise<Forecast> {
  "use cache";
  // El clima cambia poco en 15 minutos; evita golpear la API en cada visita.
  cacheLife({ stale: 300, revalidate: 900, expire: 3600 });

  const url = new URL(`${config.forecastUrl}/forecast`);
  url.searchParams.set("latitude", latitude.toFixed(2));
  url.searchParams.set("longitude", longitude.toFixed(2));
  url.searchParams.set(
    "current",
    "temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,precipitation,weather_code,is_day",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max,sunrise,sunset",
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "7");

  const raw = await getJson<RawForecast>(url);
  const d = raw.daily;

  return {
    timezone: raw.timezone,
    current: {
      temperature: raw.current.temperature_2m,
      apparentTemperature: raw.current.apparent_temperature,
      humidity: raw.current.relative_humidity_2m,
      windSpeed: raw.current.wind_speed_10m,
      precipitation: raw.current.precipitation,
      weatherCode: raw.current.weather_code,
      isDay: raw.current.is_day === 1,
    },
    daily: d.time.map((date, i) => ({
      date,
      weatherCode: d.weather_code[i],
      tempMax: d.temperature_2m_max[i],
      tempMin: d.temperature_2m_min[i],
      precipitationProbability: d.precipitation_probability_max[i] ?? 0,
      uvIndex: d.uv_index_max[i] ?? 0,
      sunrise: d.sunrise[i],
      sunset: d.sunset[i],
    })),
  };
}
