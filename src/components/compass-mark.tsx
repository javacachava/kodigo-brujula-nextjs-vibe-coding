/** Rosa de los vientos decorativa. La aguja oscila con la clase `.needle`. */
export function CompassMark({ className = "" }: { className?: string }) {
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="100" cy="100" r="94" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.5" />
      <circle cx="100" cy="100" r="46" fill="none" stroke="currentColor" strokeWidth="0.75" opacity="0.35" strokeDasharray="2 4" />
      {ticks.map((deg) => (
        <line
          key={deg}
          x1="100"
          y1="6"
          x2="100"
          y2={deg % 90 === 0 ? 24 : deg % 30 === 0 ? 17 : 12}
          stroke="currentColor"
          strokeWidth={deg % 90 === 0 ? 2 : 1}
          transform={`rotate(${deg} 100 100)`}
        />
      ))}
      <text x="100" y="42" textAnchor="middle" fontSize="13" fontWeight="700" fill="currentColor" fontFamily="var(--font-fraunces)">N</text>
      <g className="needle">
        <polygon points="100,34 108,100 92,100" style={{ fill: "var(--accent)" }} />
        <polygon points="100,166 108,100 92,100" fill="currentColor" opacity="0.85" />
      </g>
      <circle cx="100" cy="100" r="6" style={{ fill: "var(--paper)", stroke: "currentColor" }} strokeWidth="2" />
    </svg>
  );
}
