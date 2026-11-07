import Link from "next/link";

export default function CiudadNotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-display text-4xl font-medium tracking-tight">
        Ese destino no está en el mapa
      </h1>
      <p className="mt-3 text-ink-soft">
        No encontramos una ciudad con ese identificador. Prueba buscándola por nombre.
      </p>
      <Link href="/explorar" className="btn-primary mt-8">
        Buscar una ciudad
      </Link>
    </div>
  );
}
