"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFavorites } from "@/lib/use-favorites";

export const NAV_LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/explorar", label: "Explorar" },
  { href: "/favoritos", label: "Favoritos" },
  { href: "/acerca", label: "Acerca" },
] as const;

const linkClass =
  "relative rounded-full px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:text-ink aria-[current=page]:bg-paper-2 aria-[current=page]:text-ink";

/** Navegacion principal con enlace activo y contador de favoritos. */
export function SiteNav() {
  const pathname = usePathname();
  const { favorites, ready } = useFavorites();

  return (
    <nav aria-label="Principal" className="flex items-center gap-0.5 sm:gap-1">
      {NAV_LINKS.map(({ href, label }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={linkClass}
          >
            {label}
            {href === "/favoritos" && ready && favorites.length > 0 && (
              <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-[11px] font-bold leading-5 text-accent-ink">
                {favorites.length}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

/** Version estatica (sin estado activo) para el fallback de Suspense. */
export function SiteNavFallback() {
  return (
    <nav aria-label="Principal" className="flex items-center gap-0.5 sm:gap-1">
      {NAV_LINKS.map(({ href, label }) => (
        <Link key={href} href={href} className={linkClass}>
          {label}
        </Link>
      ))}
    </nav>
  );
}
