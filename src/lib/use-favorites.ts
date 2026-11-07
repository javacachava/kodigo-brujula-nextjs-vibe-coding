import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { City, FavoriteCity } from "./types";

const KEY = "brujula:favoritos";
const CHANGE_EVENT = "brujula:favoritos-change";
const EMPTY = "[]";
export const MAX_FAVORITES = 12;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

function readRaw() {
  try {
    return window.localStorage.getItem(KEY) ?? EMPTY;
  } catch {
    // Navegacion privada o almacenamiento bloqueado.
    return EMPTY;
  }
}

function isFavoriteCity(value: unknown): value is FavoriteCity {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "number" &&
    typeof v.name === "string" &&
    typeof v.country === "string" &&
    typeof v.countryCode === "string" &&
    typeof v.latitude === "number" &&
    typeof v.longitude === "number"
  );
}

function parse(raw: string): FavoriteCity[] {
  try {
    const value: unknown = JSON.parse(raw);
    return Array.isArray(value) ? value.filter(isFavoriteCity) : [];
  } catch {
    return [];
  }
}

function write(list: FavoriteCity[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* sin almacenamiento: el cambio se pierde al recargar */
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

const subscribeNoop = () => () => {};

/**
 * Favoritos persistidos en localStorage. Usa useSyncExternalStore para que el
 * servidor y la primera hidratacion coincidan (lista vacia) y despues se
 * sincronice entre pestanas con el evento `storage`.
 */
export function useFavorites() {
  const raw = useSyncExternalStore(subscribe, readRaw, () => EMPTY);
  const ready = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const favorites = useMemo(() => parse(raw), [raw]);

  const isFavorite = useCallback(
    (id: number) => favorites.some((f) => f.id === id),
    [favorites],
  );

  const toggle = useCallback((city: City | FavoriteCity) => {
    const current = parse(readRaw());
    if (current.some((f) => f.id === city.id)) {
      write(current.filter((f) => f.id !== city.id));
      return;
    }
    if (current.length >= MAX_FAVORITES) return;
    write([
      ...current,
      {
        id: city.id,
        name: city.name,
        country: city.country,
        countryCode: city.countryCode,
        admin1: city.admin1,
        latitude: city.latitude,
        longitude: city.longitude,
      },
    ]);
  }, []);

  return { favorites, ready, isFavorite, toggle };
}
