"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function GlobalSegmentError({
  error,
  retry,
}: {
  error: unknown;
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="eyebrow text-tier-poor!">Algo salió mal</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
        Perdimos el norte por un momento
      </h1>
      <p className="mt-3 text-ink-soft">
        Ocurrió un error inesperado al mostrar esta página. Puedes reintentar o volver al inicio.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className="btn-primary">
          Reintentar
        </button>
        <Link href="/" className="btn-ghost">
          Ir al inicio
        </Link>
      </div>
    </div>
  );
}
