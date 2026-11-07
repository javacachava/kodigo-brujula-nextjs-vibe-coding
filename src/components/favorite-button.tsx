"use client";

import { MAX_FAVORITES, useFavorites } from "@/lib/use-favorites";
import type { City, FavoriteCity } from "@/lib/types";

function Heart({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20.5s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.6a4.3 4.3 0 0 1 7.5 2.7c0 5.6-7.5 10.2-7.5 10.2z" />
    </svg>
  );
}

/** Boton de corazon que agrega o quita una ciudad de favoritos. */
export function FavoriteButton({
  city,
  variant = "icon",
}: {
  city: City | FavoriteCity;
  variant?: "icon" | "full";
}) {
  const { favorites, ready, isFavorite, toggle } = useFavorites();
  const active = ready && isFavorite(city.id);
  const full = ready && !active && favorites.length >= MAX_FAVORITES;

  const label = active
    ? `Quitar ${city.name} de favoritos`
    : full
      ? `Llegaste al máximo de ${MAX_FAVORITES} favoritos`
      : `Guardar ${city.name} en favoritos`;

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(city)}
        disabled={full}
        aria-pressed={active}
        className={active ? "btn-primary" : "btn-ghost"}
      >
        <Heart filled={active} />
        {active ? "En favoritos" : "Guardar en favoritos"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => toggle(city)}
      disabled={full}
      aria-pressed={active}
      aria-label={label}
      title={label}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-full border transition-colors disabled:opacity-50 ${
        active
          ? "border-accent bg-accent text-accent-ink"
          : "border-line text-ink-soft hover:border-ink-soft hover:text-ink"
      }`}
    >
      <Heart filled={active} />
    </button>
  );
}
