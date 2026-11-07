export type WeatherKind =
  | "sun"
  | "moon"
  | "partly"
  | "cloud"
  | "fog"
  | "drizzle"
  | "rain"
  | "snow"
  | "storm";

type CodeInfo = { label: string; kind: WeatherKind };

/** Codigos WMO usados por Open-Meteo: https://open-meteo.com/en/docs */
const CODES: Record<number, CodeInfo> = {
  0: { label: "Despejado", kind: "sun" },
  1: { label: "Mayormente despejado", kind: "sun" },
  2: { label: "Parcialmente nublado", kind: "partly" },
  3: { label: "Nublado", kind: "cloud" },
  45: { label: "Niebla", kind: "fog" },
  48: { label: "Niebla con escarcha", kind: "fog" },
  51: { label: "Llovizna ligera", kind: "drizzle" },
  53: { label: "Llovizna", kind: "drizzle" },
  55: { label: "Llovizna intensa", kind: "drizzle" },
  56: { label: "Llovizna helada", kind: "drizzle" },
  57: { label: "Llovizna helada intensa", kind: "drizzle" },
  61: { label: "Lluvia ligera", kind: "rain" },
  63: { label: "Lluvia", kind: "rain" },
  65: { label: "Lluvia fuerte", kind: "rain" },
  66: { label: "Lluvia helada", kind: "rain" },
  67: { label: "Lluvia helada fuerte", kind: "rain" },
  71: { label: "Nieve ligera", kind: "snow" },
  73: { label: "Nieve", kind: "snow" },
  75: { label: "Nieve fuerte", kind: "snow" },
  77: { label: "Granos de nieve", kind: "snow" },
  80: { label: "Chubascos ligeros", kind: "rain" },
  81: { label: "Chubascos", kind: "rain" },
  82: { label: "Chubascos violentos", kind: "rain" },
  85: { label: "Chubascos de nieve", kind: "snow" },
  86: { label: "Chubascos de nieve fuertes", kind: "snow" },
  95: { label: "Tormenta electrica", kind: "storm" },
  96: { label: "Tormenta con granizo", kind: "storm" },
  99: { label: "Tormenta con granizo fuerte", kind: "storm" },
};

const FALLBACK: CodeInfo = { label: "Sin datos", kind: "cloud" };

export function describeWeather(code: number, isDay = true) {
  const info = CODES[code] ?? FALLBACK;
  // De noche, el cielo despejado se muestra como luna.
  const kind: WeatherKind =
    !isDay && (info.kind === "sun" || info.kind === "partly")
      ? info.kind === "sun"
        ? "moon"
        : "partly"
      : info.kind;
  return { label: info.label, kind };
}

export function isStorm(code: number) {
  return code >= 95;
}
