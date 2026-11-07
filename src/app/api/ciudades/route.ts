import type { NextRequest } from "next/server";
import { searchCities, UpstreamError } from "@/lib/open-meteo";

/** GET /api/ciudades?q=san salvador -> { results: City[] } */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2 || q.length > 80) {
    return Response.json(
      { error: "El parametro `q` debe tener entre 2 y 80 caracteres" },
      { status: 400 },
    );
  }

  try {
    const results = await searchCities(q);
    return Response.json({ results });
  } catch (error) {
    if (error instanceof UpstreamError) {
      return Response.json({ error: error.message }, { status: 502 });
    }
    throw error;
  }
}
