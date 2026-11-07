export function CityCardSkeleton() {
  return (
    <div className="card flex flex-col gap-4 p-5" aria-hidden="true">
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-3.5 w-1/3" />
      <div className="skeleton mt-2 h-12 w-1/2" />
      <div className="skeleton h-6 w-3/4" />
    </div>
  );
}

export function ForecastSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7" aria-hidden="true">
      {Array.from({ length: 7 }, (_, i) => (
        <div key={i} className="card flex flex-col items-center gap-3 p-4">
          <div className="skeleton h-4 w-10" />
          <div className="skeleton size-9 rounded-full" />
          <div className="skeleton h-5 w-16" />
          <div className="skeleton h-1.5 w-full" />
        </div>
      ))}
    </div>
  );
}

/** Contenedor accesible para anunciar el estado de carga a lectores de pantalla. */
export function LoadingRegion({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div role="status" aria-live="polite">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
