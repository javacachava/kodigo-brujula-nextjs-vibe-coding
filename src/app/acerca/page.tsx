import type { Metadata } from "next";
import { ScoreBadge } from "@/components/score-badge";
import type { TravelScore } from "@/lib/travel-score";

export const metadata: Metadata = {
  title: "Acerca de Brújula",
  description: "Cómo se calcula el puntaje de viaje y qué tecnologías usa Brújula.",
};

const TIERS: { score: TravelScore; range: string }[] = [
  { score: { value: 80, tier: "ideal", label: "Ideal" }, range: "80 a 100" },
  { score: { value: 65, tier: "great", label: "Muy bueno" }, range: "65 a 79" },
  { score: { value: 45, tier: "ok", label: "Aceptable" }, range: "45 a 64" },
  { score: { value: 0, tier: "poor", label: "Mejor evitar" }, range: "0 a 44" },
];

const STACK = [
  ["Next.js 16 (App Router)", "Rutas, layouts anidados, Server y Client Components, Cache Components."],
  ["TypeScript", "Tipado de extremo a extremo, desde la API externa hasta la interfaz."],
  ["Tailwind CSS 4", "Sistema de diseño con variables CSS y tema claro/oscuro automático."],
  ["Open-Meteo", "API pública de geocodificación y pronóstico. No requiere clave."],
  ["Route Handlers", "/api/ciudades y /api/clima validan parámetros y encapsulan la API externa."],
];

export default function AcercaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="eyebrow">Acerca de</p>
      <h1 className="mt-2 font-display text-4xl font-medium tracking-tight sm:text-5xl">
        Un copiloto para decidir adónde ir
      </h1>
      <p className="mt-5 text-lg text-ink-soft text-pretty">
        Brújula nació como proyecto del bootcamp Full Stack Junior de Kodigo,
        construido con la metodología de <strong className="text-ink">Vibe Coding</strong>: una
        IA genera el código y el desarrollador dirige, valida e itera. El
        proceso completo está documentado en <code className="rounded bg-paper-2 px-1.5 py-0.5 text-sm">VIBE_CODING.md</code>.
      </p>

      <h2 className="mt-14 font-display text-3xl font-medium tracking-tight">
        ¿Cómo se calcula el puntaje?
      </h2>
      <p className="mt-3 text-ink-soft">
        Cada día recibe un valor de 0 a 100 que combina tres factores. Si hay
        tormenta eléctrica, se restan 20 puntos adicionales.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          ["40%", "Temperatura máxima", "Lo ideal está entre 21 y 28 °C; cada grado fuera del rango resta 6 puntos."],
          ["45%", "Probabilidad de lluvia", "Cuanto menos llueva, mejor: 0 % de lluvia suma el máximo."],
          ["15%", "Índice UV", "Por encima de 7 el sol se vuelve molesto y el puntaje baja."],
        ].map(([weight, title, text]) => (
          <li key={title} className="card p-5">
            <p className="font-display text-3xl font-medium text-accent tabular-nums">{weight}</p>
            <h3 className="mt-1 font-semibold">{title}</h3>
            <p className="mt-1 text-sm text-ink-soft">{text}</p>
          </li>
        ))}
      </ul>

      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
        {TIERS.map(({ score, range }) => (
          <li key={score.tier} className="flex items-center gap-2 text-sm text-ink-soft">
            <ScoreBadge score={score} /> {range}
          </li>
        ))}
      </ul>

      <h2 className="mt-14 font-display text-3xl font-medium tracking-tight">
        Tecnologías
      </h2>
      <dl className="mt-5 divide-y divide-line border-y border-line">
        {STACK.map(([name, text]) => (
          <div key={name} className="grid gap-1 py-4 sm:grid-cols-[14rem_1fr] sm:gap-6">
            <dt className="font-semibold">{name}</dt>
            <dd className="text-ink-soft">{text}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
