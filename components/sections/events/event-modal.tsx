"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
} from "react";
import { createPortal } from "react-dom";

import { EventGallery } from "@/components/sections/events/event-gallery";
import type { NfdEvent } from "@/data/events";
import { cn } from "@/utils/cn";
import { shouldOptimizeImage } from "@/utils/image";

type EventModalProps = {
  event: NfdEvent | null;
  onClose: () => void;
};

/**
 * Detalle completo de un evento: portada, fechas, lugar,
 * descripción, fotos y enlace.
 */
export function EventModal({
  event,
  onClose,
}: EventModalProps) {
  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  const isOpen = event !== null;

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
    closeButtonRef.current?.focus();

    function handleKeyDown(
      keyboardEvent: KeyboardEvent,
    ) {
      // Si la galería de fotos está abierta, Escape la cierra a ella primero.
      if (
        keyboardEvent.key === "Escape" &&
        !document.querySelector(
          '[aria-label^="Fotos de"]',
        )
      ) {
        onClose();
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
  }, [isOpen, onClose]);

  if (
    !event ||
    typeof document === "undefined"
  ) {
    return null;
  }

  const isUpcoming =
    event.status === "upcoming";

  return createPortal(
    <div
      className="fixed inset-0 z-[9000] flex items-end justify-center bg-ink/60 p-0 backdrop-blur-md sm:items-center sm:p-6"
      onClick={(clickEvent) => {
        if (
          clickEvent.target ===
          clickEvent.currentTarget
        ) {
          onClose();
        }
      }}
    >
      <article
        aria-labelledby="event-modal-title"
        aria-modal="true"
        className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.6rem] bg-surface text-ink shadow-[0_2rem_5rem_rgb(15_42_55/0.35)] sm:rounded-[1.6rem]"
        role="dialog"
      >
        {/* Portada */}
        <div className="relative h-44 shrink-0 overflow-hidden bg-nfd-navy sm:h-56">
          {event.coverImage ? (
            <Image
              alt={`Portada de ${event.title}`}
              className="object-cover"
              fill
              sizes="(max-width: 672px) 100vw, 42rem"
              src={event.coverImage}
              unoptimized={
                !shouldOptimizeImage(
                  event.coverImage,
                )
              }
            />
          ) : (
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 600 220"
            >
              <path
                d="M-40 170C90 150 150 60 290 80C400 96 430 170 640 120"
                opacity="0.75"
                stroke="#00a5c5"
                strokeLinecap="round"
                strokeWidth="16"
              />
              <path
                d="M-40 200C100 180 170 110 300 118C420 126 470 200 640 160"
                opacity="0.75"
                stroke="#b6005b"
                strokeLinecap="round"
                strokeWidth="22"
              />
            </svg>
          )}

          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-1.5 text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-white shadow-sm",
              isUpcoming
                ? "bg-nfd-magenta"
                : "bg-nfd-navy/85",
            )}
          >
            {isUpcoming
              ? "Próximo evento"
              : "Evento realizado"}
          </span>

          <button
            aria-label="Cerrar"
            className="absolute right-3 top-3 grid size-10 place-items-center rounded-full border border-white/25 bg-black/45 text-white backdrop-blur-xl transition-colors hover:bg-white hover:text-nfd-navy"
            onClick={onClose}
            ref={closeButtonRef}
            type="button"
          >
            <X
              aria-hidden="true"
              size={19}
            />
          </button>
        </div>

        {/* Información */}
        <div className="overflow-y-auto p-6 sm:p-8">
          <h2
            className="font-sans text-[1.6rem] font-semibold leading-tight tracking-[-0.04em] sm:text-[1.9rem]"
            id="event-modal-title"
          >
            {event.title}
          </h2>

          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink/60">
            <span className="inline-flex items-center gap-2">
              <CalendarDays
                aria-hidden="true"
                className="text-nfd-blue"
                size={16}
                strokeWidth={1.7}
              />
              {event.date}
            </span>

            {event.location ? (
              <span className="inline-flex items-center gap-2">
                <MapPin
                  aria-hidden="true"
                  className="text-nfd-magenta"
                  size={16}
                  strokeWidth={1.7}
                />
                {event.location}
              </span>
            ) : null}
          </div>

          {event.description ? (
            <p className="mt-6 whitespace-pre-line text-[0.95rem] leading-8 text-ink/70">
              {event.description}
            </p>
          ) : (
            <p className="mt-6 text-sm leading-7 text-ink/50">
              {isUpcoming
                ? "La información del encuentro será publicada cuando estén confirmados sus datos."
                : "Pronto vamos a sumar más información sobre este encuentro."}
            </p>
          )}

          {event.href ||
          event.gallery.length > 0 ? (
            <div className="mt-7 flex flex-wrap gap-3 border-t border-ink/10 pt-6">
              {event.href ? (
                <a
                  className="inline-flex min-h-10 items-center gap-2 rounded-full bg-nfd-blue px-5 text-[0.58rem] font-semibold uppercase tracking-[0.13em] text-white transition-colors hover:bg-nfd-navy"
                  href={event.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  Conocer evento
                  <ArrowUpRight
                    aria-hidden="true"
                    size={14}
                  />
                </a>
              ) : null}

              <EventGallery
                eventTitle={event.title}
                images={event.gallery}
              />
            </div>
          ) : null}
        </div>
      </article>
    </div>,
    document.body,
  );
}
