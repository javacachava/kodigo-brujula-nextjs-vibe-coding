import type { NextRequest } from "next/server";
import { searchCities } from "@/lib/open-meteo";

/** GET /api/ciudades?q=san salvador -> { results: City[] } */
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2 || q.length > 80) {
    return Response.json(
      { error: "El parámetro `q` debe tener entre 2 y 80 caracteres" },
      { status: 400 },
    );
  }

  try {
    const results = await searchCities(q);
    return Response.json({ results });
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
