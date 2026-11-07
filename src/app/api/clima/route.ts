import type { NextRequest } from "next/server";
import { getForecast, UpstreamError } from "@/lib/open-meteo";

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
      { error: "Los parametros `lat` (-90 a 90) y `lon` (-180 a 180) son obligatorios" },
      { status: 400 },
    );
  }

  try {
    return Response.json(await getForecast(lat, lon));
  } catch (error) {
    if (error instanceof UpstreamError) {
      return Response.json({ error: error.message }, { status: 502 });
    }
    throw error;
  }
}
