import Image from "next/image";
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
              href="/#inicio"
            >
              <Image
                alt=""
                className="size-20 rounded-full shadow-[0_0.75rem_2rem_rgb(0_0_0/0.35)]"
                height={160}
                src="/images/brand/nfd-logo-circular.webp"
                width={160}
              />

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
              Enfocando nuestra Energía en conSOLidar JUNTOS...
              <span className="text-nfd-magenta">
                {" "}
                #LOQUESI
              </span>
              ... QUEREMOS.
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