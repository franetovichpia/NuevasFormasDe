import { ChevronDown } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { InterrelationsMap } from "@/components/ui/interrelations-map";
import {
  proposalCards,
  proposalStatement,
  proposalValues,
  thematicAreas,
} from "@/data/proposal";

const cardStyles = {
  blue: {
    card:
      "border-nfd-blue/20 bg-nfd-blue/[0.06] hover:border-nfd-blue/35",
    number: "text-nfd-blue",
    line: "from-nfd-cyan to-nfd-blue",
  },
  magenta: {
    card:
      "border-nfd-magenta/20 bg-nfd-magenta/[0.05] hover:border-nfd-magenta/35",
    number: "text-nfd-magenta",
    line: "from-nfd-magenta to-nfd-coral",
  },
} as const;

export function ProposalSection() {
  return (
    <section
      aria-labelledby="proposal-heading"
      className="relative isolate overflow-hidden bg-paper text-ink"
      id="propuesta"
    >
      {/* Curvas decorativas */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1600 1000"
      >
        <path
          d="M-120 220C245 72 482 96 760 268C1035 439 1250 415 1710 155"
          stroke="#00a5c5"
          strokeLinecap="round"
          strokeWidth="13"
        />

        <path
          d="M-130 315C277 132 535 178 797 350C1056 519 1325 516 1712 278"
          stroke="#b6005b"
          strokeLinecap="round"
          strokeWidth="19"
        />

        <path
          d="M-145 391C311 224 568 263 858 430C1130 588 1378 579 1730 390"
          stroke="#ee4037"
          strokeLinecap="round"
          strokeWidth="7"
        />
      </svg>

      <div
        aria-hidden="true"
        className="absolute -left-40 top-10 size-[26rem] rounded-full bg-nfd-cyan/10 blur-[8rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 bottom-0 size-[28rem] rounded-full bg-nfd-magenta/10 blur-[8rem]"
      />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        {/* Encabezado */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end lg:gap-10">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.19em] text-nfd-magenta">
                Nuestra propuesta
              </p>

              <h2
                className="mt-5 max-w-[12ch] font-sans text-[clamp(2.35rem,3.8vw,4.25rem)] font-semibold leading-[0.94] tracking-[-0.045em] text-ink"
                id="proposal-heading"
              >
                Nuevas formas de vivir.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-7 lg:pl-6">
            <Reveal delay={0.08}>
              <p className="max-w-2xl font-sans text-[clamp(1.05rem,1.45vw,1.5rem)] font-normal leading-relaxed tracking-[-0.015em] text-ink/65">
                Un espacio para encontrarse, conectar experiencias y
                desarrollar propuestas desde la comunidad.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Declaración principal */}
        <Reveal
          className="mt-12"
          delay={0.1}
          distance={24}
        >
          <div className="relative overflow-hidden rounded-[1.75rem] bg-nfd-navy px-6 py-8 text-white shadow-[0_1.5rem_4rem_rgb(23_60_105/0.16)] sm:px-8 sm:py-9 lg:px-10">
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full opacity-35"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 1200 420"
            >
              <path
                d="M-70 340C192 344 289 70 551 102C775 129 856 335 1270 189"
                stroke="#00a5c5"
                strokeLinecap="round"
                strokeWidth="16"
              />

              <path
                d="M-60 392C229 395 365 171 604 184C833 196 943 395 1271 293"
                stroke="#b6005b"
                strokeLinecap="round"
                strokeWidth="23"
              />

              <path
                d="M250 430C464 293 663 282 833 356C934 399 1038 412 1238 347"
                stroke="#ee4037"
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>

            <div className="relative grid grid-cols-1 gap-7 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-3">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.19em] text-nfd-cyan">
                  Qué proponemos
                </p>

                <span
                  aria-hidden="true"
                  className="mt-4 block h-1 w-14 rounded-full bg-gradient-to-r from-nfd-cyan via-nfd-magenta to-nfd-coral"
                />
              </div>

              <div className="lg:col-span-9">
                <p className="max-w-4xl font-sans text-[clamp(1.3rem,2vw,2.2rem)] font-semibold leading-[1.22] tracking-[-0.025em] text-white">
                  {proposalStatement}
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Visión y misión */}
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {proposalCards.map((card, index) => {
            const styles = cardStyles[card.tone];

            return (
              <Reveal
                className="h-full"
                delay={0.1 + index * 0.08}
                key={card.number}
              >
                <article
                  className={`group flex h-full min-h-[16rem] flex-col rounded-[1.5rem] border p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 sm:p-7 ${styles.card}`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <p
                      className={`text-[0.62rem] font-semibold uppercase tracking-[0.18em] ${styles.number}`}
                    >
                      {card.label}
                    </p>

                    <span className="text-[0.58rem] font-medium tracking-[0.16em] text-ink/30">
                      {card.number}
                    </span>
                  </div>

                  <div className="mt-auto pt-9">
                    <div
                      aria-hidden="true"
                      className={`mb-5 h-1 w-14 rounded-full bg-gradient-to-r ${styles.line}`}
                    />

                    <p className="max-w-2xl font-sans text-[clamp(1.05rem,1.4vw,1.45rem)] font-medium leading-relaxed tracking-[-0.015em] text-ink/75">
                      {card.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        {/* Valores */}
        <Reveal
          className="mt-5"
          delay={0.18}
        >
          <div className="rounded-[1.5rem] border border-ink/10 bg-white/50 p-6 backdrop-blur-xl sm:p-7">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[0.61rem] font-semibold uppercase tracking-[0.19em] text-nfd-magenta">
                  Valores
                </p>

                <p className="mt-2 max-w-lg text-sm leading-7 text-ink/55">
                  Principios que orientan la propuesta y sus formas de
                  vinculación.
                </p>
              </div>

              <ul
                aria-label="Valores de Nuevas Formas De"
                className="flex max-w-4xl flex-wrap gap-2"
              >
                {proposalValues.map((value) => (
                  <li
                    className="rounded-full border border-ink/10 bg-white/65 px-4 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-ink/60"
                    key={value}
                  >
                    {value}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        {/* Áreas temáticas desplegables */}
        <div className="mt-12 border-t border-ink/10 pt-7">
          <Reveal>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[0.61rem] font-semibold uppercase tracking-[0.19em] text-nfd-blue">
                  Áreas temáticas
                </p>

                <h3 className="mt-3 font-sans text-[clamp(1.5rem,2.2vw,2.15rem)] font-semibold tracking-[-0.035em] text-ink">
                  Una mirada conectada.
                </h3>
              </div>

              <span className="text-[0.56rem] font-medium uppercase tracking-[0.15em] text-ink/35">
                Cinco áreas
              </span>
            </div>
          </Reveal>

          <div className="mt-7 space-y-3">
            {thematicAreas.map((area, index) => (
              <Reveal
                delay={0.05 + index * 0.04}
                key={area.number}
              >
                <details className="group overflow-hidden rounded-[1.25rem] border border-ink/10 bg-white/50 backdrop-blur-xl transition-colors duration-300 open:border-nfd-blue/25 open:bg-white/75">
                  <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-5 px-5 py-4 marker:hidden sm:px-6 [&::-webkit-details-marker]:hidden">
                    <div className="flex min-w-0 items-center gap-4 sm:gap-6">
                      <span className="shrink-0 text-[0.56rem] font-semibold tracking-[0.16em] text-nfd-blue/60">
                        {area.number}
                      </span>

                      <div className="h-8 w-px shrink-0 bg-ink/10" />

                      <h4 className="font-sans text-lg font-semibold tracking-[-0.025em] text-ink sm:text-xl">
                        Nuevas Formas de {area.label}
                      </h4>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span className="hidden text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-ink/40 sm:block">
                        Ver enfoque
                      </span>

                      <span className="grid size-9 place-items-center rounded-full border border-ink/10 bg-white/60 text-nfd-blue transition-colors duration-300 group-open:border-nfd-blue/25 group-open:bg-nfd-blue group-open:text-white">
                        <ChevronDown
                          aria-hidden="true"
                          className="transition-transform duration-300 group-open:rotate-180"
                          size={16}
                          strokeWidth={1.6}
                        />
                      </span>
                    </div>
                  </summary>

                  <div className="border-t border-ink/10 px-5 py-6 sm:px-6 lg:px-[6.6rem]">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-10">
                      <p className="text-sm leading-8 text-ink/65 sm:text-base lg:col-span-9">
                        {area.description}
                      </p>

                      <div className="lg:col-span-3">
                        <p className="text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-nfd-magenta">
                          Principios
                        </p>

                        <ul className="mt-3 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                          {area.tags.map((tag) => (
                            <li
                              className="rounded-full border border-ink/10 bg-white/70 px-3 py-2 text-[0.54rem] font-semibold uppercase tracking-[0.12em] text-ink/55"
                              key={tag}
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Interrelaciones */}
        <Reveal
          className="mt-12"
          delay={0.14}
          distance={24}
        >
          <div className="overflow-hidden rounded-[1.75rem] bg-nfd-navy p-6 text-white shadow-[0_1.5rem_4rem_rgb(23_60_105/0.16)] sm:p-8 lg:p-10">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-4">
                <p className="text-[0.61rem] font-semibold uppercase tracking-[0.19em] text-nfd-cyan">
                  Interrelaciones
                </p>

                <h3 className="mt-4 max-w-[10ch] font-sans text-[clamp(1.8rem,3vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-white">
                  Una trama compartida.
                </h3>

                <p className="mt-5 max-w-md text-sm leading-7 text-white/55">
                  Salud, nutrición, educación, comunidad y energía.
                </p>

                <div
                  aria-hidden="true"
                  className="mt-7 h-1 w-16 rounded-full bg-gradient-to-r from-nfd-cyan via-nfd-magenta to-nfd-coral"
                />
              </div>

              <div className="lg:col-span-8">
                <InterrelationsMap />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}