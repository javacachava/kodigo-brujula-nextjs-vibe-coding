import Link from "next/link";
import { CompassMark } from "@/components/compass-mark";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center sm:px-6">
      <CompassMark className="size-32 text-ink" />
      <p className="eyebrow mt-8">Error 404</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
        Esta ruta no aparece en el mapa
      </h1>
      <p className="mt-3 text-ink-soft">La página que buscas no existe o fue movida.</p>
      <Link href="/" className="btn-primary mt-8">
        Volver al inicio
      </Link>
    </div>
  );
}
