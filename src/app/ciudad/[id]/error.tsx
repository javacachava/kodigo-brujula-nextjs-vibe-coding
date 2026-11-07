"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function CiudadError({
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
      <p className="eyebrow text-tier-poor!">Error del servicio</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
        No pudimos cargar el pronóstico
      </h1>
      <p className="mt-3 text-ink-soft">
        El servicio del clima no respondió a tiempo. Tus favoritos siguen a salvo;
        intenta de nuevo en unos segundos.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <button type="button" onClick={() => retry()} className="btn-primary">
          Reintentar
        </button>
        <Link href="/explorar" className="btn-ghost">
          Buscar otro destino
        </Link>
      </div>
    </div>
  );
}
