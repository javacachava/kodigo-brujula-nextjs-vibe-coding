/*
 * Utilidades de formato. Las fechas de la API ya vienen en la hora local de la
 * ciudad (YYYY-MM-DD), por eso se interpretan como UTC y se formatean en UTC:
 * asi el resultado es identico en el servidor y en el navegador.
 */
const dayFormat = new Intl.DateTimeFormat("es", {
  weekday: "short",
  timeZone: "UTC",
});
const longDayFormat = new Intl.DateTimeFormat("es", {
  weekday: "long",
  day: "numeric",
  month: "long",
  timeZone: "UTC",
});
const shortDateFormat = new Intl.DateTimeFormat("es", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const numberFormat = new Intl.NumberFormat("es");

const toUtc = (isoDate: string) => new Date(`${isoDate}T00:00:00Z`);

export const weekday = (isoDate: string) =>
  dayFormat.format(toUtc(isoDate)).replace(".", "");
export const longDay = (isoDate: string) => longDayFormat.format(toUtc(isoDate));
export const shortDate = (isoDate: string) =>
  shortDateFormat.format(toUtc(isoDate)).replace(".", "");

/** "2026-11-06T05:52" -> "05:52" */
export const timeOf = (isoDateTime: string) => isoDateTime.slice(11, 16);

export const degrees = (n: number) => `${Math.round(n)}°`;
export const formatNumber = (n: number) => numberFormat.format(n);

/** Emoji de bandera a partir del codigo ISO de pais (SV -> bandera). */
export function flagOf(countryCode: string) {
  if (countryCode.length !== 2) return "🌐";
  return String.fromCodePoint(
    ...[...countryCode.toUpperCase()].map((c) => 0x1f1a5 + c.charCodeAt(0)),
  );
}
