import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import {
  interrelationLines,
  interrelationNodes,
  type InterrelationColor,
} from "@/data/interrelations";

const nodeColors: Record<
  InterrelationColor,
  {
    background: string;
    border: string;
    text: string;
    dot: string;
  }
> = {
  cyan: {
    background: "bg-nfd-cyan/10",
    border: "border-nfd-cyan/35",
    text: "text-nfd-cyan",
    dot: "#00a5c5",
  },
  blue: {
    background: "bg-nfd-blue/10",
    border: "border-nfd-blue/35",
    text: "text-nfd-blue",
    dot: "#006f98",
  },
  magenta: {
    background: "bg-nfd-magenta/10",
    border: "border-nfd-magenta/35",
    text: "text-nfd-magenta",
    dot: "#b6005b",
  },
  coral: {
    background: "bg-nfd-coral/10",
    border: "border-nfd-coral/35",
    text: "text-nfd-coral",
    dot: "#ee4037",
  },
  green: {
    background: "bg-emerald-500/10",
    border: "border-emerald-500/35",
    text: "text-emerald-600",
    dot: "#21a878",
  },
};

function getNode(nodeId: string) {
  return interrelationNodes.find(
    (node) => node.id === nodeId,
  );
}

export function InterrelationsSection() {
  return (
    <section
      aria-labelledby="interrelations-heading"
      className="relative isolate overflow-hidden bg-nfd-navy text-white"
      id="interrelaciones"
    >
      {/* Fondos ambientales */}
      <div
        aria-hidden="true"
        className="absolute -left-40 top-0 size-[30rem] rounded-full bg-nfd-cyan/10 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 bottom-0 size-[32rem] rounded-full bg-nfd-magenta/10 blur-[9rem]"
      />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        {/* Encabezado */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-nfd-cyan">
                Interrelaciones
              </p>

              <h2
                className="mt-5 max-w-[11ch] font-sans text-[clamp(2.35rem,3.8vw,4.25rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-white"
                id="interrelations-heading"
              >
                Una mirada conectada.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            <Reveal delay={0.08}>
              <p className="max-w-2xl font-sans text-[clamp(1.05rem,1.45vw,1.5rem)] leading-relaxed text-white/60">
                Salud, alimentación, educación, comunidad y energía.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Esquema para escritorio */}
        <Reveal
          className="mt-12 hidden md:block"
          delay={0.12}
          distance={28}
        >
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.045] p-6 backdrop-blur-xl lg:p-8">
            <svg
              aria-labelledby="interrelations-diagram-title interrelations-diagram-description"
              className="h-auto w-full"
              role="img"
              viewBox="0 0 800 600"
            >
              <title id="interrelations-diagram-title">
                Interrelaciones de Nuevas Formas De
              </title>

              <desc id="interrelations-diagram-description">
                Diagrama formado por Nuevas Formas De en el centro y las
                áreas de salud, alimentación, educación, comunidad y
                energía vinculadas a su alrededor.
              </desc>

              <defs>
                <filter
                  height="160%"
                  id="node-glow"
                  width="160%"
                  x="-30%"
                  y="-30%"
                >
                  <feGaussianBlur
                    result="blur"
                    stdDeviation="12"
                  />

                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <radialGradient id="central-gradient">
                  <stop
                    offset="0%"
                    stopColor="#006f98"
                  />

                  <stop
                    offset="60%"
                    stopColor="#173c69"
                  />

                  <stop
                    offset="100%"
                    stopColor="#102b4c"
                  />
                </radialGradient>
              </defs>

              {/* Líneas centrales */}
              {interrelationNodes.map((node) => (
                <line
                  key={`central-${node.id}`}
                  opacity="0.38"
                  stroke={nodeColors[node.color].dot}
                  strokeWidth="2"
                  x1="400"
                  x2={node.x}
                  y1="310"
                  y2={node.y}
                />
              ))}

              {/* Vínculos exteriores */}
              {interrelationLines.map(
                ([originId, destinationId]) => {
                  const origin = getNode(originId);
                  const destination =
                    getNode(destinationId);

                  if (!origin || !destination) {
                    return null;
                  }

                  return (
                    <line
                      key={`${originId}-${destinationId}`}
                      opacity="0.16"
                      stroke="#ffffff"
                      strokeDasharray="5 10"
                      strokeWidth="1"
                      x1={origin.x}
                      x2={destination.x}
                      y1={origin.y}
                      y2={destination.y}
                    />
                  );
                },
              )}

              {/* Nodo central */}
              <circle
                cx="400"
                cy="310"
                fill="url(#central-gradient)"
                filter="url(#node-glow)"
                r="92"
                stroke="#ffffff"
                strokeOpacity="0.24"
                strokeWidth="2"
              />

              <circle
                cx="400"
                cy="310"
                fill="none"
                r="108"
                stroke="#00a5c5"
                strokeDasharray="3 9"
                strokeOpacity="0.32"
                strokeWidth="1"
              />

              <text
                fill="#ffffff"
                fontFamily="sans-serif"
                fontSize="19"
                fontWeight="600"
                textAnchor="middle"
                x="400"
                y="299"
              >
                Nuevas
              </text>

              <text
                fill="#ffffff"
                fontFamily="sans-serif"
                fontSize="19"
                fontWeight="600"
                textAnchor="middle"
                x="400"
                y="323"
              >
                Formas De...
              </text>

              <text
                fill="#ffffff"
                fillOpacity="0.42"
                fontFamily="sans-serif"
                fontSize="8"
                letterSpacing="2.5"
                textAnchor="middle"
                x="400"
                y="345"
              >
                INTERRELACIONES
              </text>

              {/* Nodos temáticos */}
              {interrelationNodes.map((node) => {
                const colors = nodeColors[node.color];

                return (
                  <g key={node.id}>
                    <circle
                      cx={node.x}
                      cy={node.y}
                      fill={colors.dot}
                      fillOpacity="0.13"
                      r={node.radius + 11}
                    />

                    <circle
                      cx={node.x}
                      cy={node.y}
                      fill="#173c69"
                      r={node.radius}
                      stroke={colors.dot}
                      strokeOpacity="0.85"
                      strokeWidth="2"
                    />

                    <circle
                      cx={node.x}
                      cy={node.y - 21}
                      fill={colors.dot}
                      r="4"
                    />

                    <text
                      fill="#ffffff"
                      fontFamily="sans-serif"
                      fontSize="13"
                      fontWeight="600"
                      textAnchor="middle"
                      x={node.x}
                      y={node.y + 3}
                    >
                      {node.label}
                    </text>

                    <text
                      fill="#ffffff"
                      fillOpacity="0.38"
                      fontFamily="sans-serif"
                      fontSize="8"
                      letterSpacing="2"
                      textAnchor="middle"
                      x={node.x}
                      y={node.y + 24}
                    >
                      {node.number}
                    </text>
                  </g>
                );
              })}

              {/* Referencia inferior */}
              <g
                fill="#ffffff"
                fillOpacity="0.35"
                fontFamily="sans-serif"
                fontSize="8"
                letterSpacing="2.5"
              >
                <text
                  x="32"
                  y="555"
                >
                  ÁREAS CONECTADAS
                </text>

                <text
                  textAnchor="end"
                  x="768"
                  y="555"
                >
                  NUEVAS FORMAS DE...
                </text>
              </g>
            </svg>
          </div>
        </Reveal>

        {/* Versión para celular */}
        <div className="mt-10 md:hidden">
          <Reveal>
            <div className="rounded-[1.5rem] border border-white/15 bg-white/[0.055] p-6 text-center backdrop-blur-xl">
              <span className="mx-auto grid size-28 place-items-center rounded-full border border-nfd-cyan/40 bg-nfd-blue/20 shadow-[0_0_3rem_rgb(0_165_197/0.16)]">
                <span className="font-sans text-lg font-semibold leading-tight text-white">
                  Nuevas
                  <span className="block">
                    Formas De...
                  </span>
                </span>
              </span>

              <p className="mt-5 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white/35">
                Interrelaciones
              </p>
            </div>
          </Reveal>

          <div className="mt-3 grid grid-cols-2 gap-3">
            {interrelationNodes.map((node, index) => {
              const colors = nodeColors[node.color];

              return (
                <Reveal
                  className={
                    index ===
                    interrelationNodes.length - 1
                      ? "col-span-2"
                      : undefined
                  }
                  delay={0.05 + index * 0.05}
                  key={node.id}
                >
                  <article
                    className={`rounded-[1.25rem] border p-5 text-center ${colors.background} ${colors.border}`}
                  >
                    <span
                      aria-hidden="true"
                      className="mx-auto block size-2 rounded-full"
                      style={{
                        backgroundColor: colors.dot,
                      }}
                    />

                    <h3 className="mt-4 font-sans text-base font-semibold text-white">
                      {node.label}
                    </h3>

                    <p
                      className={`mt-2 text-[0.56rem] font-semibold tracking-[0.16em] ${colors.text}`}
                    >
                      {node.number}
                    </p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}