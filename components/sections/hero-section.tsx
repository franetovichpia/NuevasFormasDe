import Image from "next/image";
import {
  ArrowDownRight,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { nfdLinks } from "@/data/nfd-links";

const experienceAreas = [
  {
    number: "01",
    label: "Actividades",
    color: "bg-nfd-blue",
    href: "#actividades",
  },
  {
    number: "02",
    label: "Eventos",
    color: "bg-nfd-magenta",
    href: "#eventos",
  },
  {
    number: "03",
    label: "Nexo Azul",
    color: "bg-nfd-coral",
    href: "#nexo-azul",
  },
] as const;

function TitleLines() {
  return (
    <svg
      aria-hidden="true"
      className="mt-6 h-16 w-full max-w-xl"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 620 70"
    >
      <path
        d="M5 20C150 3 276 7 410 27C490 39 550 39 615 19"
        stroke="#00a5c5"
        strokeLinecap="round"
        strokeWidth="8"
      />

      <path
        d="M5 36C150 18 287 22 414 41C499 54 551 51 615 34"
        stroke="#006f98"
        strokeLinecap="round"
        strokeWidth="3"
      />

      <path
        d="M5 52C170 38 298 40 423 54C504 63 558 60 615 48"
        stroke="#b6005b"
        strokeLinecap="round"
        strokeWidth="11"
      />

      <path
        d="M420 54C492 64 552 60 615 49"
        stroke="#ee4037"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="identity-field relative isolate min-h-svh overflow-hidden text-ink"
      id="inicio"
    >
      <svg
        aria-hidden="true"
        className="curve-drift absolute inset-0 h-full w-full opacity-[0.14]"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1600 900"
      >
        <path
          d="M-150 686C218 648 326 178 739 205C1058 225 1196 530 1750 349"
          stroke="#00a5c5"
          strokeLinecap="round"
          strokeWidth="18"
        />

        <path
          d="M-150 735C236 711 382 280 781 294C1113 306 1287 632 1750 475"
          stroke="#006f98"
          strokeLinecap="round"
          strokeWidth="7"
        />

        <path
          d="M-150 802C283 797 454 395 839 407C1174 418 1370 745 1750 608"
          stroke="#b6005b"
          strokeLinecap="round"
          strokeWidth="24"
        />

        <path
          d="M-150 842C309 853 516 485 895 493C1224 500 1412 795 1750 702"
          stroke="#ee4037"
          strokeLinecap="round"
          strokeWidth="9"
        />
      </svg>

      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background via-background/95 to-transparent lg:w-[68%]"
      />

      <div
        aria-hidden="true"
        className="absolute -left-48 top-1/4 size-[30rem] rounded-full bg-nfd-cyan/8 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-48 top-0 size-[32rem] rounded-full bg-nfd-magenta/8 blur-[9rem]"
      />

      <Container className="relative flex min-h-svh flex-col pb-7 pt-28 sm:pb-10 sm:pt-32">
        <div className="flex items-center justify-between gap-5 border-b border-ink/10 pb-5">
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-nfd-blue">
            Emiliano Gabriel Rossotti
          </p>

          <p className="text-right text-[0.56rem] font-medium uppercase tracking-[0.17em] text-ink/45">
            Nuevas Formas De
          </p>
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-12 py-14 lg:grid-cols-12 lg:py-12">
          <div className="relative z-10 lg:col-span-7">
            <Reveal>
              <p className="mb-7 text-[0.63rem] font-semibold uppercase tracking-[0.22em] text-nfd-magenta">
                CoCrear juntos
              </p>

              <h1
                className="max-w-[11ch] font-sans text-[clamp(3.45rem,7.2vw,7.8rem)] font-bold leading-[0.9] tracking-[-0.065em] text-[#050608]"
                id="hero-heading"
              >
                <span className="block">
                  Nuevas
                </span>

                <span className="block">
                  FORMAS De...
                </span>
              </h1>

              <TitleLines />
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-xl font-sans text-[clamp(1rem,1.45vw,1.3rem)] font-normal leading-relaxed text-ink/70">
                Enfocando nuestra Energía
                en conSOLidar JUNTOS...
                <span className="font-semibold text-nfd-magenta">
                  {" "}
                  #LOQUESI
                </span>
                ... Queremos.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  className="glass-interactive inline-flex min-h-12 items-center gap-3 rounded-full border border-nfd-blue bg-nfd-blue px-6 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-white shadow-[0_1rem_2.5rem_rgb(0_111_152/0.2)] hover:bg-nfd-navy"
                  href="#actividades"
                >
                  Explorar actividades

                  <ArrowDownRight
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.6}
                  />
                </a>

                <a
                  aria-label="Ver novedades en Instagram"
                  className="glass-interactive inline-flex min-h-12 items-center gap-3 rounded-full border border-ink/15 bg-white/55 px-6 text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-ink/70 backdrop-blur-xl hover:border-nfd-magenta/40 hover:text-nfd-magenta"
                  href={nfdLinks.instagram}
                  rel="noreferrer"
                  target="_blank"
                >
                  <FaInstagram
                    aria-hidden="true"
                    size={16}
                  />

                  Novedades
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal
            className="lg:col-span-5"
            delay={0.12}
            distance={34}
          >
            <div className="relative mx-auto aspect-square w-full max-w-[30rem]">
              <div
                aria-hidden="true"
                className="absolute -inset-4 rounded-full border border-nfd-blue/15"
              />

              <div
                aria-hidden="true"
                className="absolute -inset-8 rounded-full border border-nfd-magenta/10"
              />

              <div className="glass-surface relative h-full w-full overflow-hidden rounded-full p-2 shadow-[0_2rem_6rem_rgb(0_111_152/0.14)] sm:p-3">
                <Image
                  alt="Logo oficial de Nuevas Formas De..."
                  className="h-full w-full object-contain drop-shadow-[0_1.5rem_2.5rem_rgb(0_0_0/0.12)]"
                  height={1654}
                  priority
                  sizes="(min-width: 1024px) 38vw, 82vw"
                  src="/images/brand/nfd-logo.png"
                  width={1654}
                />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {experienceAreas.map(
            (area, index) => (
              <Reveal
                delay={
                  0.2 +
                  index * 0.07
                }
                key={area.number}
              >
                <a
                  className="glass-surface glass-interactive flex min-h-20 items-center gap-4 rounded-[1.15rem] px-5 py-4"
                  href={area.href}
                >
                  <span className="text-[0.58rem] font-medium tracking-[0.16em] text-ink/35">
                    {area.number}
                  </span>

                  <span
                    aria-hidden="true"
                    className={`h-px flex-1 ${area.color}`}
                  />

                  <span className="text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-ink/65">
                    {area.label}
                  </span>
                </a>
              </Reveal>
            ),
          )}
        </div>
      </Container>
    </section>
  );
}