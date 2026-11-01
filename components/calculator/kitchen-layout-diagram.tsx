import type { KitchenLayoutId } from "@/lib/calculator/types";

const labelPositions: Record<
  KitchenLayoutId,
  { key: string; x: number; y: number }[]
> = {
  "l-shaped": [
    { key: "A", x: 41, y: 84 },
    { key: "B", x: 104, y: 37 },
  ],
  straight: [{ key: "A", x: 104, y: 66 }],
  "u-shaped": [
    { key: "A", x: 36, y: 78 },
    { key: "B", x: 100, y: 32 },
    { key: "C", x: 164, y: 78 },
  ],
  parallel: [
    { key: "A", x: 104, y: 38 },
    { key: "B", x: 104, y: 102 },
  ],
};

function Sink({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <rect className="fixture" x={x} y={y} width="34" height="16" rx="2" />
      <circle className="fixture" cx={x + 17} cy={y + 8} r="5" />
    </g>
  );
}

function Hob({ x, y, vertical = false }: { x: number; y: number; vertical?: boolean }) {
  const offsets = vertical
    ? [
        [0, -5],
        [11, -5],
        [0, 6],
        [11, 6],
      ]
    : [
        [-5, 0],
        [6, 0],
        [-5, 11],
        [6, 11],
      ];
  return (
    <g>
      {offsets.map(([dx, dy], index) => (
        <circle key={index} className="hob" cx={x + dx} cy={y + dy} r="4" />
      ))}
    </g>
  );
}

export default function KitchenLayoutDiagram({
  layout,
  showLabels = false,
  className,
}: {
  layout: KitchenLayoutId;
  showLabels?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`calc-diagram${className ? ` ${className}` : ""}`}
      viewBox="0 0 200 140"
      role="img"
      aria-label={`${layout.replace("-", " ")} kitchen layout`}
    >
      {layout === "l-shaped" && (
        <>
          <rect className="counter" x="28" y="24" width="26" height="96" />
          <rect className="counter" x="28" y="24" width="144" height="26" />
          <rect className="counter-edge" x="28" y="24" width="26" height="96" />
          <rect className="counter-edge" x="28" y="24" width="144" height="26" />
          <Sink x={64} y={29} />
          <Hob x={153} y={36} vertical />
        </>
      )}

      {layout === "straight" && (
        <>
          <rect className="counter" x="20" y="52" width="160" height="28" />
          <rect className="counter-edge" x="20" y="52" width="160" height="28" />
          <Sink x={50} y={57} />
          <Hob x={142} y={61} />
        </>
      )}

      {layout === "u-shaped" && (
        <>
          <rect className="counter" x="24" y="20" width="24" height="100" />
          <rect className="counter" x="24" y="20" width="152" height="24" />
          <rect className="counter" x="152" y="20" width="24" height="100" />
          <rect className="counter-edge" x="24" y="20" width="24" height="100" />
          <rect className="counter-edge" x="24" y="20" width="152" height="24" />
          <rect className="counter-edge" x="152" y="20" width="24" height="100" />
          <Sink x={58} y={25} />
          <Hob x={164} y={76} vertical />
        </>
      )}

      {layout === "parallel" && (
        <>
          <rect className="counter" x="28" y="26" width="144" height="24" />
          <rect className="counter" x="44" y="90" width="128" height="24" />
          <rect className="counter-edge" x="28" y="26" width="144" height="24" />
          <rect className="counter-edge" x="44" y="90" width="128" height="24" />
          <Sink x={54} y={31} />
          <Hob x={130} y={101} />
        </>
      )}

      {showLabels &&
        labelPositions[layout].map((label) => (
          <text
            key={label.key}
            className="calc-diagram-label"
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label.key}
          </text>
        ))}
    </svg>
  );
}
