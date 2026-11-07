import type { NextRequest } from "next/server";
import { getForecast } from "@/lib/open-meteo";

function parseCoordinate(value: string | null, limit: number) {
  if (value === null || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : null;
}

/** GET /api/clima?lat=13.69&lon=-89.19 -> Forecast */
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const lat = parseCoordinate(params.get("lat"), 90);
  const lon = parseCoordinate(params.get("lon"), 180);

  if (lat === null || lon === null) {
    return Response.json(
      { error: "Los parámetros `lat` (-90 a 90) y `lon` (-180 a 180) son obligatorios" },
      { status: 400 },
    );
  }

  try {
    return Response.json(await getForecast(lat, lon));
  } catch (error) {
    // Los errores lanzados dentro de una funcion `use cache` cruzan la frontera
    // de cache sin su clase ni su mensaje (en produccion llegan sanitizados),
    // por eso no se puede usar `instanceof` aqui: cualquier falla se traduce a 502.
    console.error("[api] fallo al consultar Open-Meteo", error);
    return Response.json(
      { error: "El servicio del clima no está disponible. Intenta de nuevo en unos segundos." },
      { status: 502 },
    );
  }
}
