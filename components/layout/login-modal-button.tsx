"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  LogIn,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { cn } from "@/utils/cn";

type LoginModalButtonProps = {
  /** Debe incluir la clase de display (por ejemplo "inline-flex"). */
  className?: string;
  onOpen?: () => void;
};

/**
 * Botón "Ingresar" del sitio: abre un modal con acceso al panel.
 */
export function LoginModalButton({
  className,
  onOpen,
}: LoginModalButtonProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const primaryActionRef =
    useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const previousActiveElement =
      document.activeElement instanceof
      HTMLElement
        ? document.activeElement
        : null;

    document.body.style.overflow = "hidden";
    primaryActionRef.current?.focus();

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

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

      previousActiveElement?.focus();
    };
  }, [isOpen]);

  const modal =
    isOpen &&
    typeof document !== "undefined"
      ? createPortal(
          <div
            className="fixed inset-0 z-[9999] grid place-items-center bg-ink/55 p-4 backdrop-blur-md"
            onClick={(event) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                setIsOpen(false);
              }
            }}
          >
            <div
              aria-describedby="login-modal-description"
              aria-labelledby="login-modal-title"
              aria-modal="true"
              className="relative w-full max-w-sm rounded-[1.6rem] border border-white/70 bg-surface p-7 text-center text-ink shadow-[0_2rem_5rem_rgb(15_42_55/0.3)] sm:p-8"
              role="dialog"
            >
              <button
                aria-label="Cerrar"
                className="absolute right-3 top-3 grid size-9 place-items-center rounded-full text-ink/50 transition-colors hover:bg-ink/5 hover:text-ink"
                onClick={() => {
                  setIsOpen(false);
                }}
                type="button"
              >
                <X
                  aria-hidden="true"
                  size={18}
                />
              </button>

              <Image
                alt="Nuevas Formas De..."
                className="mx-auto size-24 rounded-full shadow-[0_0.75rem_2rem_rgb(15_42_55/0.15)]"
                height={192}
                src="/images/brand/nfd-logo-circular.webp"
                width={192}
              />

              <h2
                className="mt-5 text-xl font-semibold tracking-[-0.03em]"
                id="login-modal-title"
              >
                Panel de contenidos
              </h2>

              <p
                className="mt-2 text-sm leading-relaxed text-ink/55"
                id="login-modal-description"
              >
                Acceso exclusivo para el equipo de Nuevas Formas
                De… para cargar eventos y entrevistas.
              </p>

              <Link
                className="mt-6 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-nfd-blue px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-nfd-navy"
                href="/admin/login"
                ref={primaryActionRef}
              >
                Ingresar al panel
                <ArrowRight
                  aria-hidden="true"
                  size={15}
                />
              </Link>

              <button
                className="mt-2 min-h-10 w-full rounded-full text-xs font-semibold text-ink/50 transition-colors hover:text-ink"
                onClick={() => {
                  setIsOpen(false);
                }}
                type="button"
              >
                Cancelar
              </button>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        aria-haspopup="dialog"
        className={cn(
          "glass-interactive min-h-11 items-center gap-2 rounded-full border border-ink/15 bg-white/60 pl-1.5 pr-4 text-[0.61rem] font-semibold uppercase tracking-[0.13em] text-ink/70 hover:border-nfd-blue/40 hover:text-nfd-blue",
          className,
        )}
        onClick={() => {
          onOpen?.();
          setIsOpen(true);
        }}
        type="button"
      >
        <Image
          alt=""
          className="size-8 rounded-full"
          height={64}
          src="/images/brand/nfd-logo-circular.webp"
          width={64}
        />

        <span className="inline-flex items-center gap-1.5">
          <LogIn
            aria-hidden="true"
            size={14}
            strokeWidth={1.7}
          />
          Ingresar
        </span>
      </button>

      {modal}
    </>
  );
}
