"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";
import {
  CalendarDays,
  Menu,
  X,
} from "lucide-react";

import { LoginModalButton } from "@/components/layout/login-modal-button";
import { Container } from "@/components/ui/container";
import { mainNavigation } from "@/data/navigation";
import { cn } from "@/utils/cn";

export function SiteHeader() {
  const [isScrolled, setIsScrolled] =
    useState(false);

  const [isMenuOpen, setIsMenuOpen] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(
        window.scrollY > 18,
      );
    };

    handleScroll();

    window.addEventListener(
      "scroll",
      handleScroll,
      {
        passive: true,
      },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown,
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [isMenuOpen]);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[100] pt-3 sm:pt-4">
      <Container className="pointer-events-auto">
        <div
          className={cn(
            "relative flex min-h-16 items-center justify-between rounded-[1.3rem] border px-3 py-2 transition-all duration-500 sm:px-4",
            isScrolled
              ? "border-white/80 bg-surface/85 shadow-[0_1.25rem_3.5rem_rgb(15_42_55/0.14)] backdrop-blur-2xl"
              : "border-white/65 bg-white/55 shadow-[0_0.75rem_2.5rem_rgb(15_42_55/0.07)] backdrop-blur-xl",
          )}
        >
          {/* Identidad */}
          <Link
            aria-label="Nuevas Formas De, volver al inicio"
            className="group flex items-center gap-3 rounded-xl"
            href="/#inicio"
            onClick={closeMenu}
          >
            <span className="relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-full border border-ink/10 bg-white/70">
              <Image
                alt=""
                className="object-contain"
                fill
                sizes="44px"
                src="/images/brand/nfd-logo.png"
              />
            </span>

            <span className="hidden leading-tight sm:block">
              <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.15em] text-ink">
                Nuevas Formas
              </span>

              <span className="mt-1 block text-[0.58rem] uppercase tracking-[0.16em] text-nfd-blue">
                De...
              </span>
            </span>
          </Link>

          {/* Navegación desktop */}
          <nav
            aria-label="Navegación principal"
            className="hidden xl:block"
          >
            <ul className="flex items-center gap-1">
              {mainNavigation.map(
                (item) => (
                  <li key={item.href}>
                    <Link
                      className="relative rounded-full px-3 py-3 text-[0.61rem] font-medium uppercase tracking-[0.12em] text-ink/80 transition-colors duration-300 after:absolute after:bottom-2 after:left-3 after:h-px after:w-0 after:bg-nfd-magenta after:transition-all after:duration-300 hover:text-ink hover:after:w-[calc(100%-1.5rem)]"
                      href={item.href}
                    >
                      {item.label}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </nav>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            <LoginModalButton className="hidden xl:inline-flex" />

            <Link
              className="glass-interactive hidden min-h-11 items-center gap-2 rounded-full bg-nfd-blue px-5 text-[0.61rem] font-semibold uppercase tracking-[0.13em] text-white shadow-[0_0.8rem_2rem_rgb(0_111_152/0.2)] hover:bg-nfd-navy xl:inline-flex"
              href="/#eventos"
            >
              <CalendarDays
                aria-hidden="true"
                size={15}
                strokeWidth={1.6}
              />

              Ver eventos
            </Link>

            <button
              aria-controls="mobile-navigation"
              aria-expanded={isMenuOpen}
              aria-label={
                isMenuOpen
                  ? "Cerrar menú"
                  : "Abrir menú"
              }
              className={cn(
                "glass-interactive grid size-11 place-items-center rounded-full border xl:hidden",
                isMenuOpen
                  ? "border-ink bg-ink text-white"
                  : "border-ink/15 bg-white/60 text-ink",
              )}
              onClick={() => {
                setIsMenuOpen(
                  (currentValue) =>
                    !currentValue,
                );
              }}
              type="button"
            >
              {isMenuOpen ? (
                <X
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1.7}
                />
              ) : (
                <Menu
                  aria-hidden="true"
                  size={20}
                  strokeWidth={1.7}
                />
              )}
            </button>
          </div>

          {/* Menú mobile */}
          {isMenuOpen ? (
            <div
              className="absolute left-0 right-0 top-[calc(100%+0.75rem)] overflow-hidden rounded-[1.5rem] border border-white/80 bg-surface/95 text-ink shadow-[0_2rem_5rem_rgb(15_42_55/0.2)] backdrop-blur-2xl xl:hidden"
              id="mobile-navigation"
            >
              <nav
                aria-label="Navegación móvil"
                className="p-4 sm:p-5"
              >
                <div className="mb-4 flex items-center justify-between px-3 py-2">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-nfd-magenta">
                    Navegación
                  </p>

                  <p className="text-[0.56rem] uppercase tracking-[0.15em] text-ink/35">
                    Nuevas Formas De
                  </p>
                </div>

                <ul className="flex flex-col">
                  {mainNavigation.map(
                    (item, index) => (
                      <li
                        className="border-b border-ink/10 last:border-b-0"
                        key={item.href}
                      >
                        <Link
                          className="group flex items-center justify-between rounded-xl px-3 py-4 font-sans text-xl font-medium tracking-[-0.025em] text-ink transition-colors duration-300 hover:bg-nfd-cyan/10"
                          href={item.href}
                          onClick={closeMenu}
                        >
                          <span>
                            {item.label}
                          </span>

                          <span className="text-[0.58rem] font-medium uppercase tracking-[0.14em] text-nfd-blue/60">
                            {String(
                              index + 1,
                            ).padStart(
                              2,
                              "0",
                            )}
                          </span>
                        </Link>
                      </li>
                    ),
                  )}
                </ul>

                <div className="mt-5 flex flex-col gap-3 border-t border-ink/10 pt-5">
                  <LoginModalButton
                    className="flex w-full justify-center"
                    onOpen={closeMenu}
                  />

                  <Link
                    className="flex min-h-12 w-full items-center justify-center gap-3 rounded-full bg-nfd-blue px-5 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-white"
                    href="/#eventos"
                    onClick={closeMenu}
                  >
                    <CalendarDays
                      aria-hidden="true"
                      size={15}
                      strokeWidth={1.6}
                    />

                    Ver eventos
                  </Link>
                </div>
              </nav>
            </div>
          ) : null}
        </div>
      </Container>
    </header>
  );
}