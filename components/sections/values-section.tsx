import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import {
  proposalCards,
  proposalValues,
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

/**
 * Visión, misión y valores: más abajo en la página,
 * para quien quiera conocer en profundidad la propuesta.
 */
export function ValuesSection() {
  return (
    <section
      aria-labelledby="values-heading"
      className="relative isolate scroll-mt-28 overflow-hidden bg-paper text-ink"
      id="valores"
    >
      <div
        aria-hidden="true"
        className="absolute -right-40 top-0 size-[26rem] rounded-full bg-nfd-cyan/10 blur-[8rem]"
      />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <Reveal>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.19em] text-nfd-magenta">
            Visión, misión y valores
          </p>

          <h2
            className="mt-5 max-w-[14ch] font-sans text-[clamp(2.1rem,3.4vw,3.8rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-ink"
            id="values-heading"
          >
            Lo que nos guía.
          </h2>
        </Reveal>

        <div className="mt-10">
        {/* Visión y misión */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

        </div>
      </Container>
    </section>
  );
}
