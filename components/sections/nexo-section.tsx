import {
  ArrowUpRight,
  ExternalLink,
  Video,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { nfdLinks } from "@/data/nfd-links";

export function NexoSection() {
  return (
    <section
      aria-labelledby="nexo-heading"
      className="relative isolate scroll-mt-28 overflow-hidden bg-nfd-navy text-white"
      id="nexo-azul"
    >
      {/* Curvas decorativas */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.16]"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1600 620"
      >
        <path
          d="M-120 430C236 370 397 92 791 127C1112 156 1238 388 1700 236"
          stroke="#00a5c5"
          strokeLinecap="round"
          strokeWidth="28"
        />

        <path
          d="M-120 487C285 432 456 201 830 221C1154 239 1330 458 1700 341"
          stroke="#006f98"
          strokeLinecap="round"
          strokeWidth="12"
        />

        <path
          d="M-120 545C325 509 517 298 895 310C1231 321 1393 518 1700 441"
          stroke="#b6005b"
          strokeLinecap="round"
          strokeWidth="34"
        />

        <path
          d="M412 520C666 446 907 451 1122 514"
          stroke="#ee4037"
          strokeLinecap="round"
          strokeWidth="9"
        />
      </svg>

      <div
        aria-hidden="true"
        className="absolute -left-32 top-0 size-[24rem] rounded-full bg-nfd-cyan/10 blur-[8rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-32 bottom-0 size-[24rem] rounded-full bg-nfd-magenta/10 blur-[8rem]"
      />

      <Container className="relative py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Información */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.61rem] font-semibold uppercase tracking-[0.2em] text-nfd-cyan">
                Encuentro virtual
              </p>

              <h2
                className="mt-4 font-sans text-[clamp(2.8rem,5vw,4.8rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white"
                id="nexo-heading"
              >
                Nexo Azul.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/60 sm:text-base">
                Acceso DOM25 a la sala virtual de Nuevas Formas De.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <div className="mt-7 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <a
                  className="glass-interactive inline-flex min-h-11 items-center gap-3 rounded-full bg-nfd-cyan px-5 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-nfd-navy shadow-[0_1rem_2.5rem_rgb(0_165_197/0.18)] hover:bg-white"
                  href={nfdLinks.virtualRoom}
                  rel="noreferrer"
                  target="_blank"
                >
                  <Video
                    aria-hidden="true"
                    size={16}
                    strokeWidth={1.6}
                  />

                  Ingresar a la sala

                  <ArrowUpRight
                    aria-hidden="true"
                    size={15}
                    strokeWidth={1.6}
                  />
                </a>

                <div className="flex items-center gap-2 text-[0.58rem] uppercase tracking-[0.13em] text-white/40">
                  <ExternalLink
                    aria-hidden="true"
                    className="shrink-0 text-nfd-cyan"
                    size={14}
                    strokeWidth={1.5}
                  />

                  Jitsi Meet
                </div>
              </div>
            </Reveal>
          </div>

          {/* Interfaz visual compacta */}
          <Reveal
            className="lg:col-span-7"
            delay={0.1}
            distance={28}
          >
            <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/[0.07] p-3 shadow-[0_1.75rem_4rem_rgb(0_0_0/0.18)] backdrop-blur-xl sm:p-4">
              {/* Barra superior */}
              <div className="flex items-center justify-between border-b border-white/10 px-2 pb-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-nfd-magenta" />
                  <span className="size-1.5 rounded-full bg-nfd-coral" />
                  <span className="size-1.5 rounded-full bg-nfd-cyan" />
                </div>

                <span className="text-[0.53rem] font-medium uppercase tracking-[0.16em] text-white/35">
                  Sala virtual
                </span>
              </div>

              {/* Pantalla */}
              <div className="relative mt-3 min-h-[17rem] overflow-hidden rounded-[1.15rem] bg-[#edf3f5] sm:min-h-[19rem]">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 900 400"
                >
                  <path
                    d="M-80 220C145 139 294 96 491 123C650 145 752 224 980 157"
                    stroke="#00a5c5"
                    strokeLinecap="round"
                    strokeWidth="31"
                  />

                  <path
                    d="M-80 270C163 197 321 177 507 201C670 222 779 289 980 231"
                    stroke="#006f98"
                    strokeLinecap="round"
                    strokeWidth="13"
                  />

                  <path
                    d="M-80 327C184 263 357 256 538 278C698 297 821 353 980 308"
                    stroke="#b6005b"
                    strokeLinecap="round"
                    strokeWidth="35"
                  />

                  <path
                    d="M352 300C489 330 618 323 737 294"
                    stroke="#ee4037"
                    strokeLinecap="round"
                    strokeWidth="9"
                  />

                  <g
                    opacity="0.1"
                    stroke="#0b1115"
                    strokeDasharray="6 12"
                    strokeWidth="1"
                  >
                    <path d="M150 0V400" />
                    <path d="M450 0V400" />
                    <path d="M750 0V400" />
                  </g>
                </svg>

                <div className="absolute inset-0 grid place-items-center p-6 text-center">
                  <div>
                    <div className="mx-auto grid size-12 place-items-center rounded-full border border-ink/10 bg-white/75 text-nfd-blue shadow-lg backdrop-blur-xl">
                      <Video
                        aria-hidden="true"
                        size={21}
                        strokeWidth={1.4}
                      />
                    </div>

                    <p className="mt-5 text-[0.55rem] font-semibold uppercase tracking-[0.19em] text-nfd-magenta">
                      Nuevas Formas De
                    </p>

                    <p className="mt-2 font-sans text-[clamp(2rem,4vw,3.6rem)] font-semibold leading-none tracking-[-0.055em] text-ink">
                      Nexo Azul
                    </p>

                    <p className="mt-3 text-[0.54rem] font-medium uppercase tracking-[0.17em] text-ink/40">
                      DOM25
                    </p>
                  </div>
                </div>
              </div>

              {/* Pie */}
              <div className="flex items-center justify-between px-2 pt-3">
                <span className="text-[0.52rem] uppercase tracking-[0.14em] text-white/30">
                  Plataforma externa
                </span>

                <a
                  className="flex items-center gap-2 text-[0.54rem] font-semibold uppercase tracking-[0.14em] text-nfd-cyan transition-colors hover:text-white"
                  href={nfdLinks.virtualRoom}
                  rel="noreferrer"
                  target="_blank"
                >
                  Acceder

                  <ArrowUpRight
                    aria-hidden="true"
                    size={13}
                    strokeWidth={1.6}
                  />
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}