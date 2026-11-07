import { LoadingRegion } from "@/components/skeletons";

export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <LoadingRegion label="Cargando…">
        <div className="skeleton h-4 w-32" />
        <div className="skeleton mt-4 h-12 w-2/3 max-w-lg" />
      </LoadingRegion>
    </div>
  );
}
