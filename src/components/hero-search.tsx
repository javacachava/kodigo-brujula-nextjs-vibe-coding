"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/** Formulario de la portada: lleva la busqueda a /explorar?q=... */
export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = query.trim();
    router.push(q ? `/explorar?q=${encodeURIComponent(q)}` : "/explorar");
  }

  return (
    <form onSubmit={onSubmit} role="search" className="flex flex-col gap-3 sm:flex-row">
      <label htmlFor="hero-q" className="sr-only">
        Ciudad de destino
      </label>
      <input
        id="hero-q"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="¿A dónde quieres ir? Ej. Lima, Roma, Kioto…"
        autoComplete="off"
        className="min-h-12 flex-1 rounded-full border border-line bg-surface px-5 text-base text-ink placeholder:text-ink-soft/80 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
      />
      <button type="submit" className="btn-primary min-h-12 px-7">
        Ver pronóstico
      </button>
    </form>
  );
}
