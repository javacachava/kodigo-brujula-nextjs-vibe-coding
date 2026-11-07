import { ForecastSkeleton, LoadingRegion } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <LoadingRegion label="Cargando pronóstico…">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton mt-6 h-14 w-2/3 max-w-md" />
        <div className="skeleton mt-3 h-4 w-1/2 max-w-sm" />
        <div className="card mt-8 grid gap-6 p-8 lg:grid-cols-2">
          <div className="skeleton h-24 w-full" />
          <div className="grid grid-cols-3 gap-3">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="skeleton h-16" />
            ))}
          </div>
        </div>
        <div className="mt-10">
          <ForecastSkeleton />
        </div>
      </LoadingRegion>
    </div>
  );
}
