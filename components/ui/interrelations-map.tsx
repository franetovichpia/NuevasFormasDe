const diagramNodes = [
  {
    number: "01",
    label: "Salud",
    x: 175,
    y: 170,
    color: "#00a5c5",
  },
  {
    number: "02",
    label: "Alimentación",
    x: 175,
    y: 450,
    color: "#ee4037",
  },
  {
    number: "03",
    label: "Educación",
    x: 450,
    y: 105,
    color: "#006f98",
  },
  {
    number: "04",
    label: "Comunidad",
    x: 725,
    y: 180,
    color: "#b6005b",
  },
  {
    number: "05",
    label: "Energía",
    x: 725,
    y: 445,
    color: "#f29b38",
  },
] as const;

const mobileNodeClasses = [
  "border-nfd-cyan/30 bg-nfd-cyan/[0.08]",
  "border-nfd-coral/30 bg-nfd-coral/[0.08]",
  "border-nfd-blue/30 bg-nfd-blue/[0.08]",
  "border-nfd-magenta/30 bg-nfd-magenta/[0.08]",
  "border-orange-400/30 bg-orange-400/[0.08]",
] as const;

export function InterrelationsMap() {
  return (
    <div
      aria-label="Esquema conceptual que conecta salud, alimentación, educación, comunidad y energía con Nuevas Formas De"
      className="relative"
      role="img"
    >
      {/* Versión para celulares */}
      <div
        aria-hidden="true"
        className="relative md:hidden"
      >
        <div className="mx-auto max-w-xs rounded-[1.25rem] border border-white/20 bg-white/10 px-5 py-5 text-center backdrop-blur-xl">
          <span className="text-[0.56rem] font-semibold uppercase tracking-[0.18em] text-nfd-cyan">
            Centro de la trama
          </span>

          <p className="mt-2 font-sans text-lg font-semibold text-white">
            Nuevas Formas De...
          </p>
        </div>

        <div
          aria-hidden="true"
          className="mx-auto h-8 w-px bg-gradient-to-b from-nfd-cyan to-white/15"
        />

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {diagramNodes.map((node, index) => (
            <div
              className={`rounded-[1rem] border px-4 py-4 ${mobileNodeClasses[index]}`}
              key={node.number}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="font-sans text-sm font-semibold text-white">
                  {node.label}
                </span>

                <span className="text-[0.54rem] font-medium tracking-[0.15em] text-white/40">
                  {node.number}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Versión para tablet y escritorio */}
      <svg
        aria-hidden="true"
        className="hidden h-auto w-full md:block"
        fill="none"
        viewBox="0 0 900 590"
      >
        <defs>
          <pattern
            height="32"
            id="interrelations-small-grid"
            patternUnits="userSpaceOnUse"
            width="32"
          >
            <path
              d="M32 0H0V32"
              opacity="0.07"
              stroke="#ffffff"
              strokeWidth="1"
            />
          </pattern>

          <radialGradient id="interrelations-center-gradient">
            <stop
              offset="0%"
              stopColor="#006f98"
            />

            <stop
              offset="100%"
              stopColor="#173c69"
            />
          </radialGradient>

          <filter
            height="160%"
            id="interrelations-glow"
            width="160%"
            x="-30%"
            y="-30%"
          >
            <feGaussianBlur
              result="blur"
              stdDeviation="9"
            />

            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <rect
          fill="url(#interrelations-small-grid)"
          height="590"
          rx="30"
          width="900"
        />

        {/* Circunferencia conceptual */}
        <ellipse
          cx="450"
          cy="300"
          opacity="0.12"
          rx="350"
          ry="225"
          stroke="#ffffff"
          strokeDasharray="7 13"
          strokeWidth="1.5"
        />

        {/* Conexiones con el centro */}
        {diagramNodes.map((node) => (
          <path
            d={`M450 310 Q${(450 + node.x) / 2} ${
              (310 + node.y) / 2 - 22
            } ${node.x} ${node.y}`}
            key={`connection-${node.number}`}
            opacity="0.52"
            stroke={node.color}
            strokeLinecap="round"
            strokeWidth="3"
          />
        ))}

        {/* Conexiones exteriores */}
        <path
          d="M175 170Q105 305 175 450"
          opacity="0.22"
          stroke="#ffffff"
          strokeDasharray="6 9"
          strokeWidth="1.5"
        />

        <path
          d="M175 170Q295 65 450 105"
          opacity="0.22"
          stroke="#ffffff"
          strokeDasharray="6 9"
          strokeWidth="1.5"
        />

        <path
          d="M450 105Q605 65 725 180"
          opacity="0.22"
          stroke="#ffffff"
          strokeDasharray="6 9"
          strokeWidth="1.5"
        />

        <path
          d="M725 180Q795 310 725 445"
          opacity="0.22"
          stroke="#ffffff"
          strokeDasharray="6 9"
          strokeWidth="1.5"
        />

        <path
          d="M725 445Q450 560 175 450"
          opacity="0.22"
          stroke="#ffffff"
          strokeDasharray="6 9"
          strokeWidth="1.5"
        />

        {/* Nodo central */}
        <circle
          cx="450"
          cy="310"
          fill="#006f98"
          filter="url(#interrelations-glow)"
          opacity="0.22"
          r="112"
        />

        <circle
          cx="450"
          cy="310"
          fill="url(#interrelations-center-gradient)"
          r="91"
          stroke="#ffffff"
          strokeOpacity="0.28"
          strokeWidth="1.5"
        />

        <text
          fill="#ffffff"
          fontFamily="sans-serif"
          fontSize="11"
          fontWeight="600"
          letterSpacing="3"
          opacity="0.55"
          textAnchor="middle"
          x="450"
          y="282"
        >
          CENTRO
        </text>

        <text
          fill="#ffffff"
          fontFamily="sans-serif"
          fontSize="20"
          fontWeight="600"
          textAnchor="middle"
          x="450"
          y="314"
        >
          Nuevas Formas
        </text>

        <text
          fill="#ffffff"
          fontFamily="sans-serif"
          fontSize="20"
          fontWeight="600"
          textAnchor="middle"
          x="450"
          y="340"
        >
          De...
        </text>

        {/* Nodos temáticos */}
        {diagramNodes.map((node) => (
          <g key={node.number}>
            <circle
              cx={node.x}
              cy={node.y}
              fill={node.color}
              filter="url(#interrelations-glow)"
              opacity="0.15"
              r="72"
            />

            <circle
              cx={node.x}
              cy={node.y}
              fill="#173c69"
              r="57"
              stroke={node.color}
              strokeOpacity="0.85"
              strokeWidth="2"
            />

            <text
              fill={node.color}
              fontFamily="sans-serif"
              fontSize="9"
              fontWeight="600"
              letterSpacing="2"
              textAnchor="middle"
              x={node.x}
              y={node.y - 12}
            >
              {node.number}
            </text>

            <text
              fill="#ffffff"
              fontFamily="sans-serif"
              fontSize={
                node.label === "Alimentación"
                  ? "13"
                  : "15"
              }
              fontWeight="600"
              textAnchor="middle"
              x={node.x}
              y={node.y + 14}
            >
              {node.label}
            </text>
          </g>
        ))}

        <text
          fill="#ffffff"
          fontFamily="sans-serif"
          fontSize="10"
          fontWeight="500"
          letterSpacing="3"
          opacity="0.32"
          x="35"
          y="555"
        >
          ESQUEMA CONCEPTUAL
        </text>
      </svg>
    </div>
  );
}