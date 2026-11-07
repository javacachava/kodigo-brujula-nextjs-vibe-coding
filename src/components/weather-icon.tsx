import type { WeatherKind } from "@/lib/weather-codes";

const CLOUD = "M7 15a3.5 3.5 0 0 1-.4-6.98A5 5 0 0 1 16.3 7.2 4 4 0 0 1 17 15H7z";

/** Iconos de clima en linea, hereda el color con `currentColor`. */
export function WeatherIcon({
  kind,
  className = "size-8",
  title,
}: {
  kind: WeatherKind;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {kind === "sun" && (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
        </>
      )}
      {kind === "moon" && <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />}
      {kind === "partly" && (
        <>
          <circle cx="8.5" cy="8" r="2.8" />
          <path d="M8.5 2.2v1.2M2.7 8h1.2M4.4 3.9l.9.9M12.6 3.9l-.9.9" />
          <path d="M9 20a3.3 3.3 0 0 1-.3-6.6A4.6 4.6 0 0 1 17.4 12.6 3.7 3.7 0 0 1 18 20H9z" />
        </>
      )}
      {kind === "cloud" && <path d="M7 19a4 4 0 0 1-.5-7.97A5.5 5.5 0 0 1 17 9.5 4.75 4.75 0 0 1 17.5 19H7z" />}
      {kind === "fog" && (
        <>
          <path d={CLOUD} />
          <path d="M5 18.5h14M8 21.5h8" />
        </>
      )}
      {kind === "drizzle" && (
        <>
          <path d={CLOUD} />
          <path d="M9 18.5v1M13 18.5v1M17 18.5v1M11 21v1M15 21v1" />
        </>
      )}
      {kind === "rain" && (
        <>
          <path d={CLOUD} />
          <path d="M8.5 17.5l-1 3M12.5 17.5l-1 3M16.5 17.5l-1 3" />
        </>
      )}
      {kind === "snow" && (
        <>
          <path d={CLOUD} />
          <path d="M8 18v.01M12 18v.01M16 18v.01M10 21v.01M14 21v.01" strokeWidth="2.4" />
        </>
      )}
      {kind === "storm" && (
        <>
          <path d={CLOUD} />
          <path d="M12.5 15.5l-2.5 3.5h3l-2 3" />
        </>
      )}
    </svg>
  );
}
