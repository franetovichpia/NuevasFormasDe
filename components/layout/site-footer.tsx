import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";

import { Container } from "@/components/ui/container";
import { mainNavigation } from "@/data/navigation";
import { nfdLinks } from "@/data/nfd-links";

const novaireUrl =
  process.env.NEXT_PUBLIC_NOVAIRE_URL;

function FooterMark() {
  return (
    <svg
      aria-hidden="true"
      className="size-16"
      fill="none"
      viewBox="0 0 72 72"
    >
      <circle
        cx="36"
        cy="36"
        fill="#edf3f5"
        r="34"
      />

      <path
        d="M2 33C15 17 30 12 47 17C59 21 67 30 72 42"
        stroke="#00a5c5"
        strokeLinecap="round"
        strokeWidth="8"
      />

      <path
        d="M1 44C18 57 37 54 47 43C55 35 62 34 73 40"
        stroke="#b6005b"
        strokeLinecap="round"
        strokeWidth="9"
      />

      <path
        d="M42 17C57 13 66 23 62 36C59 46 48 47 41 40"
        stroke="#173c69"
        strokeWidth="5"
      />

      <path
        d="M45 46C53 50 60 45 63 39"
        stroke="#ee4037"
        strokeLinecap="round"
        strokeWidth="4"
      />
    </svg>
  );
}

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      {/* Curvas */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-15"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1600 620"
      >
        <path
          d="M-100 400C276 320 445 65 816 109C1127 146 1290 390 1700 233"
          stroke="#00a5c5"
          strokeLinecap="round"
          strokeWidth="26"
        />

        <path
          d="M-100 496C315 433 500 211 865 233C1184 252 1362 487 1700 371"
          stroke="#b6005b"
          strokeLinecap="round"
          strokeWidth="37"
        />

        <path
          d="M451 536C690 451 939 461 1174 554"
          stroke="#ee4037"
          strokeLinecap="round"
          strokeWidth="10"
        />
      </svg>

      <Container className="relative pb-8 pt-20 sm:pt-24">
        <div className="grid grid-cols-1 gap-14 border-b border-white/15 pb-16 lg:grid-cols-12">
          {/* Identidad */}
          <div className="lg:col-span-5">
            <Link
              aria-label="Nuevas Formas De, volver al inicio"
              className="inline-flex items-center gap-4"
              href="#inicio"
            >
              <FooterMark />

              <span>
                <span className="block text-sm font-semibold uppercase tracking-[0.16em] text-white">
                  Nuevas Formas
                </span>

                <span className="mt-2 block text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-nfd-cyan">
                  De...
                </span>
              </span>
            </Link>

            <p className="mt-8 max-w-md text-sm leading-7 text-white/50">
              Enfocando nuestra Energía en CoCrear JUNTOS...
              <span className="text-nfd-magenta">
                {" "}
                #LOQUESI
              </span>
              ... Queremos.
            </p>
          </div>

          {/* Navegación */}
          <div className="lg:col-span-4">
            <p className="text-[0.59rem] font-semibold uppercase tracking-[0.18em] text-nfd-cyan">
              Navegación
            </p>

            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4">
              {mainNavigation.map((item) => (
                <li key={item.href}>
                  <Link
                    className="text-xs font-medium uppercase tracking-[0.12em] text-white/50 transition-colors duration-300 hover:text-white"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="lg:col-span-3">
            <p className="text-[0.59rem] font-semibold uppercase tracking-[0.18em] text-nfd-magenta">
              Contacto
            </p>

            <div className="mt-6 flex flex-col gap-3">
              <a
                className="glass-interactive inline-flex items-center justify-between rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-xs text-white/60 hover:text-white"
                href={nfdLinks.whatsapp}
                rel="noreferrer"
                target="_blank"
              >
                <span className="flex items-center gap-3">
                  <FaWhatsapp
                    aria-hidden="true"
                    size={16}
                  />

                  WhatsApp
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.5}
                />
              </a>

              <a
                className="glass-interactive inline-flex items-center justify-between rounded-full border border-white/15 bg-white/[0.06] px-5 py-3 text-xs text-white/60 hover:text-white"
                href={nfdLinks.instagram}
                rel="noreferrer"
                target="_blank"
              >
                <span className="flex items-center gap-3">
                  <FaInstagram
                    aria-hidden="true"
                    size={16}
                  />

                  Instagram
                </span>

                <ArrowUpRight
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.5}
                />
              </a>
            </div>
          </div>
        </div>

        {/* Créditos */}
        <div className="flex flex-col gap-4 pt-7 text-[0.58rem] uppercase tracking-[0.14em] text-white/35 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {currentYear} Nuevas Formas De
          </p>

          {novaireUrl ? (
            <a
              className="inline-flex items-center gap-2 transition-colors duration-300 hover:text-nfd-cyan"
              href={novaireUrl}
              rel="noreferrer"
              target="_blank"
            >
              Desarrollado por Novaire Studio

              <ArrowUpRight
                aria-hidden="true"
                size={13}
                strokeWidth={1.5}
              />
            </a>
          ) : (
            <span>
              Desarrollado por Novaire Studio
            </span>
          )}
        </div>
      </Container>
    </footer>
  );
}