"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Images,
  X,
} from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

import { shouldOptimizeImage } from "@/utils/image";

type EventGalleryProps = {
  eventTitle: string;
  images: readonly string[];
};

export function EventGallery({
  eventTitle,
  images,
}: EventGalleryProps) {
  const [isOpen, setIsOpen] =
    useState(false);

  const [currentIndex, setCurrentIndex] =
    useState(0);

  const closeButtonRef =
    useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow =
      document.body.style.overflow;

    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    document.body.style.overflow = "hidden";

    closeButtonRef.current?.focus();

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }

      if (
        event.key === "ArrowLeft" &&
        images.length > 1
      ) {
        setCurrentIndex((current) =>
          current === 0
            ? images.length - 1
            : current - 1,
        );
      }

      if (
        event.key === "ArrowRight" &&
        images.length > 1
      ) {
        setCurrentIndex((current) =>
          current === images.length - 1
            ? 0
            : current + 1,
        );
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
  }, [
    images.length,
    isOpen,
  ]);

  if (images.length === 0) {
    return null;
  }

  function openGallery() {
    setCurrentIndex(0);
    setIsOpen(true);
  }

  function closeGallery() {
    setIsOpen(false);
  }

  function showPreviousImage() {
    setCurrentIndex((current) =>
      current === 0
        ? images.length - 1
        : current - 1,
    );
  }

  function showNextImage() {
    setCurrentIndex((current) =>
      current === images.length - 1
        ? 0
        : current + 1,
    );
  }

  const currentImage =
    images[currentIndex];

  const modal =
    isOpen &&
    typeof document !== "undefined"
      ? createPortal(
          <div
            aria-label={`Fotos de ${eventTitle}`}
            aria-modal="true"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#07131d]/95 p-3 backdrop-blur-xl sm:p-6"
            role="dialog"
          >
            <div className="relative h-full w-full">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative h-[calc(100vh-2rem)] w-full max-w-[94rem] sm:h-[calc(100vh-3rem)]">
                  <Image
                    alt={`Fotografía ${currentIndex + 1} de ${eventTitle}`}
                    className="object-contain"
                    fill
                    priority
                    sizes="100vw"
                    src={currentImage}
                    unoptimized={
                      !shouldOptimizeImage(
                        currentImage,
                      )
                    }
                  />
                </div>
              </div>

              <button
                aria-label="Cerrar galería"
                className="absolute right-2 top-2 z-20 grid size-11 place-items-center rounded-full border border-white/20 bg-black/45 text-white shadow-xl backdrop-blur-xl transition-colors hover:bg-white hover:text-nfd-navy sm:right-4 sm:top-4 sm:size-12"
                onClick={closeGallery}
                ref={closeButtonRef}
                type="button"
              >
                <X
                  aria-hidden="true"
                  size={22}
                  strokeWidth={1.6}
                />
              </button>

              {images.length > 1 ? (
                <>
                  <button
                    aria-label="Ver fotografía anterior"
                    className="absolute left-2 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-white shadow-xl backdrop-blur-xl transition-colors hover:bg-white hover:text-nfd-navy sm:left-4 sm:size-12"
                    onClick={showPreviousImage}
                    type="button"
                  >
                    <ChevronLeft
                      aria-hidden="true"
                      size={25}
                      strokeWidth={1.6}
                    />
                  </button>

                  <button
                    aria-label="Ver fotografía siguiente"
                    className="absolute right-2 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/45 text-white shadow-xl backdrop-blur-xl transition-colors hover:bg-white hover:text-nfd-navy sm:right-4 sm:size-12"
                    onClick={showNextImage}
                    type="button"
                  >
                    <ChevronRight
                      aria-hidden="true"
                      size={25}
                      strokeWidth={1.6}
                    />
                  </button>
                </>
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        className="inline-flex min-h-9 items-center gap-2 rounded-full bg-nfd-blue px-4 text-[0.53rem] font-semibold uppercase tracking-[0.13em] text-white transition-colors duration-300 hover:bg-nfd-navy"
        onClick={openGallery}
        type="button"
      >
        <Images
          aria-hidden="true"
          size={14}
          strokeWidth={1.6}
        />

        Ver fotos
      </button>

      {modal}
    </>
  );
}