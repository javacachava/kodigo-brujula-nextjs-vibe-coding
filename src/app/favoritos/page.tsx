import type { Metadata } from "next";
import { FavoritesBoard } from "@/components/favorites-board";

export const metadata: Metadata = {
  title: "Mis favoritos",
  description: "Compara el clima de tus destinos guardados.",
};

export default function FavoritosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow">Tu lista</p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Destinos favoritos
      </h1>
      <p className="mt-3 mb-10 max-w-2xl text-lg text-ink-soft">
        Se guardan en este navegador y se actualizan con el pronóstico en vivo.
      </p>
      <FavoritesBoard />
    </div>
  );
}
