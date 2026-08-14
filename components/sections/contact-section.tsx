import { ArrowUpRight } from "lucide-react";
import {
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { nfdLinks } from "@/data/nfd-links";

const contactChannels = [
  {
    number: "01",
    eyebrow: "Contacto directo",
    title: "WhatsApp",
    action: "Iniciar conversación",
    href: nfdLinks.whatsapp,
    icon: FaWhatsapp,
    color: "text-nfd-blue",
    background:
      "border-nfd-cyan/25 bg-nfd-cyan/8",
    line: "bg-nfd-cyan",
  },
  {
    number: "02",
    eyebrow: "Novedades",
    title: "Instagram",
    action: "Visitar perfil",
    href: nfdLinks.instagram,
    icon: FaInstagram,
    color: "text-nfd-magenta",
    background:
      "border-nfd-magenta/25 bg-nfd-magenta/8",
    line: "bg-nfd-magenta",
  },
] as const;

export function ContactSection() {
  return (
    <section
      aria-labelledby="contact-heading"
      className="relative isolate overflow-hidden bg-background text-ink"
      id="contacto"
    >
      {/* Curvas */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.08]"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1600 760"
      >
        <path
          d="M-100 535C256 460 427 120 815 170C1121 209 1265 490 1700 315"
          stroke="#00a5c5"
          strokeLinecap="round"
          strokeWidth="27"
        />

        <path
          d="M-100 622C295 558 479 272 851 296C1175 316 1352 601 1700 471"
          stroke="#b6005b"
          strokeLinecap="round"
          strokeWidth="39"
        />

        <path
          d="M410 653C666 562 925 581 1146 687"
          stroke="#ee4037"
          strokeLinecap="round"
          strokeWidth="11"
        />
      </svg>

      <div
        aria-hidden="true"
        className="absolute -left-40 top-0 size-[30rem] rounded-full bg-nfd-cyan/8 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 bottom-0 size-[30rem] rounded-full bg-nfd-magenta/7 blur-[9rem]"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-12">
          {/* Encabezado */}
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-nfd-magenta">
                Canales disponibles
              </p>

              <h2
                className="mt-6 max-w-[8ch] font-sans text-[clamp(3rem,6vw,6.3rem)] font-semibold leading-[0.88] tracking-[-0.06em] text-ink"
                id="contact-heading"
              >
                Contacto.
              </h2>
            </Reveal>

            <Reveal delay={0.08}>
              <p className="mt-8 max-w-xl font-sans text-[clamp(1.05rem,1.7vw,1.5rem)] font-normal leading-relaxed text-ink/65">
                Canales de comunicación y novedades de Nuevas Formas De.
              </p>
            </Reveal>
          </div>

          {/* Canales */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {contactChannels.map(
              (channel, index) => {
                const Icon = channel.icon;

                return (
                  <Reveal
                    className="h-full"
                    delay={0.1 + index * 0.08}
                    key={channel.title}
                  >
                    <a
                      aria-label={`${channel.action} mediante ${channel.title}`}
                      className="glass-surface glass-interactive group flex h-full min-h-[19rem] flex-col rounded-[1.6rem] p-6 sm:p-7"
                      href={channel.href}
                      rel="noreferrer"
                      target="_blank"
                    >
                      <div className="flex items-start justify-between">
                        <span
                          className={`grid size-12 place-items-center rounded-full border ${channel.background} ${channel.color}`}
                        >
                          <Icon
                            aria-hidden="true"
                            size={21}
                          />
                        </span>

                        <span className="text-[0.57rem] font-medium tracking-[0.16em] text-ink/30">
                          {channel.number}
                        </span>
                      </div>

                      <div className="mt-auto pt-14">
                        <div
                          aria-hidden="true"
                          className={`mb-5 h-1 w-14 rounded-full ${channel.line}`}
                        />

                        <p className="text-[0.58rem] font-semibold uppercase tracking-[0.17em] text-ink/40">
                          {channel.eyebrow}
                        </p>

                        <h3 className="mt-3 font-sans text-3xl font-semibold leading-none tracking-[-0.045em] text-ink">
                          {channel.title}
                        </h3>

                        <div className="mt-7 flex items-center justify-between border-t border-ink/10 pt-5">
                          <span className="text-[0.57rem] font-semibold uppercase tracking-[0.14em] text-ink/50">
                            {channel.action}
                          </span>

                          <ArrowUpRight
                            aria-hidden="true"
                            className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                            size={17}
                            strokeWidth={1.6}
                          />
                        </div>
                      </div>
                    </a>
                  </Reveal>
                );
              },
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}