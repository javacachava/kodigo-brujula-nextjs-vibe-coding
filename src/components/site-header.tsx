import Link from "next/link";
import { Suspense } from "react";
import { CompassMark } from "./compass-mark";
import { SiteNav, SiteNavFallback } from "./site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1 px-4 py-2.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-ink">
          <CompassMark className="size-8" />
          <span className="font-display text-xl font-semibold tracking-tight">
            Brújula
          </span>
        </Link>
        <Suspense fallback={<SiteNavFallback />}>
          <SiteNav />
        </Suspense>
      </div>
    </header>
  );
}
