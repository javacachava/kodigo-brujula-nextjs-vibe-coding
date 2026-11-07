import type { TravelScore } from "@/lib/travel-score";

const TIER_CLASS: Record<TravelScore["tier"], string> = {
  ideal: "text-tier-ideal bg-tier-ideal/12 ring-tier-ideal/35",
  great: "text-tier-great bg-tier-great/12 ring-tier-great/35",
  ok: "text-tier-ok bg-tier-ok/12 ring-tier-ok/35",
  poor: "text-tier-poor bg-tier-poor/12 ring-tier-poor/35",
};

export function ScoreBadge({
  score,
  className = "",
}: {
  score: TravelScore;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${TIER_CLASS[score.tier]} ${className}`}
      title={`Puntaje de viaje: ${score.value} de 100`}
    >
      <span className="tabular-nums">{score.value}</span>
      <span className="font-semibold">{score.label}</span>
    </span>
  );
}

export function scoreBarColor(tier: TravelScore["tier"]) {
  return {
    ideal: "bg-tier-ideal",
    great: "bg-tier-great",
    ok: "bg-tier-ok",
    poor: "bg-tier-poor",
  }[tier];
}
