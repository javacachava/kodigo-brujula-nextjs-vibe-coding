/**
 * Configuracion leida desde variables de entorno (.env.local en desarrollo,
 * panel de Vercel en produccion). Se definen valores por defecto para que la
 * app funcione con el plan gratuito de Open-Meteo sin configurar nada.
 */
export const config = {
  geocodingUrl:
    process.env.GEOCODING_API_URL ?? "https://geocoding-api.open-meteo.com/v1",
  forecastUrl: process.env.FORECAST_API_URL ?? "https://api.open-meteo.com/v1",
  apiKey: process.env.OPEN_METEO_API_KEY || undefined,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;
