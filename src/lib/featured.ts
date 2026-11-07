import type { FavoriteCity } from "./types";

/**
 * Destinos destacados de la portada. Los ids son los de GeoNames y las
 * coordenadas se guardan aqui para no hacer una llamada extra de geocodificacion.
 */
export const FEATURED: FavoriteCity[] = [
  { id: 3583361, name: "San Salvador", country: "El Salvador", countryCode: "SV", admin1: "San Salvador", latitude: 13.68935, longitude: -89.18718 },
  { id: 3530597, name: "Ciudad de México", country: "México", countryCode: "MX", admin1: "Ciudad de México", latitude: 19.42847, longitude: -99.12766 },
  { id: 3435910, name: "Buenos Aires", country: "Argentina", countryCode: "AR", admin1: "Buenos Aires", latitude: -34.61315, longitude: -58.37723 },
  { id: 2988507, name: "París", country: "Francia", countryCode: "FR", admin1: "Isla de Francia", latitude: 48.85341, longitude: 2.3488 },
  { id: 1850147, name: "Tokio", country: "Japón", countryCode: "JP", admin1: "Tokio", latitude: 35.6895, longitude: 139.69171 },
  { id: 2147714, name: "Sídney", country: "Australia", countryCode: "AU", admin1: "Nueva Gales del Sur", latitude: -33.86785, longitude: 151.20732 },
];
