export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          Datos meteorológicos de{" "}
          <a
            href="https://open-meteo.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline decoration-accent decoration-2 underline-offset-4"
          >
            Open-Meteo.com
          </a>{" "}
          (licencia CC BY 4.0).
        </p>
        <p>Proyecto Kodigo · Full Stack Junior 34 · Hecho con Next.js y Vibe Coding</p>
      </div>
    </footer>
  );
}
