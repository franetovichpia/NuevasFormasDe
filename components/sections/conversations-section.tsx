"use client";

import Link from "next/link";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRef } from "react";

import { Reveal } from "@/components/motion/reveal";
import {
  ConversationCard,
  getPreferredMedia,
  platformRailWidthClasses,
} from "@/components/sections/conversations/conversation-card";
import {
  ConversationFilters,
  useConversationFilters,
} from "@/components/sections/conversations/conversation-filters";
import { Container } from "@/components/ui/container";
import type { Conversation } from "@/data/conversations";
import { getArchiveHref } from "@/lib/conversation-filters";
import { cn } from "@/utils/cn";

const FEATURED_COUNT = 6;

type ConversationsSectionProps = {
  conversations: readonly Conversation[];
};

export function ConversationsSection({
  conversations,
}: ConversationsSectionProps) {
  const carouselRef =
    useRef<HTMLDivElement>(null);

  const filters =
    useConversationFilters(conversations);

  const featuredConversations =
    filters.filtered.slice(0, FEATURED_COUNT);

  function resetCarousel() {
    requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    });
  }

  function moveCarousel(
    direction: "previous" | "next",
  ) {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    const distance =
      carousel.clientWidth * 0.82;

    carousel.scrollBy({
      left:
        direction === "next"
          ? distance
          : -distance,
      behavior: "smooth",
    });
  }

  return (
    <section
      aria-labelledby="conversations-heading"
      className="relative isolate scroll-mt-28 overflow-hidden bg-paper text-ink"
      id="conversaciones"
    >
      <div
        aria-hidden="true"
        className="absolute -left-48 top-16 size-[34rem] rounded-full bg-nfd-cyan/10 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-48 bottom-0 size-[34rem] rounded-full bg-nfd-magenta/8 blur-[9rem]"
      />

      <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-72 w-full opacity-[0.055]"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 1600 400"
      >
        <path
          d="M-80 302C258 92 449 72 723 209C1019 357 1265 315 1680 77"
          stroke="#00a5c5"
          strokeLinecap="round"
          strokeWidth="18"
        />

        <path
          d="M-90 349C276 155 493 143 775 255C1067 371 1315 359 1688 158"
          stroke="#b6005b"
          strokeLinecap="round"
          strokeWidth="9"
        />
      </svg>

      <Container className="relative py-20 sm:py-24 lg:py-28">
        {/* Encabezado */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-nfd-magenta">
                Conversaciones
              </p>

              <h2
                className="mt-6 max-w-[10ch] font-sans text-[clamp(2.7rem,5vw,5.4rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-ink"
                id="conversations-heading"
              >
                Entrevistas y podcast.
              </h2>
            </Reveal>
          </div>

          <div className="flex items-end lg:col-span-7 lg:pl-8">
            <Reveal delay={0.08}>
              <p className="max-w-2xl font-sans text-[clamp(1.1rem,1.8vw,1.65rem)] font-normal leading-relaxed text-ink/60">
                Enfocando nuestra Energía en
                conSOLidar JUNTOS...{" "}

                <span className="font-semibold text-nfd-blue">
                  #LOQUESI
                </span>

                ... QUEREMOS.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Filtros y controles */}
        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="w-full lg:max-w-3xl">
            <ConversationFilters
              {...filters}
              onChange={resetCarousel}
            />
          </Reveal>

          {featuredConversations.length > 1 ? (
            <Reveal delay={0.08}>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Ver entrevistas anteriores"
                  className="glass-interactive grid size-10 place-items-center rounded-full border border-ink/10 bg-white/55 text-ink/55 backdrop-blur-xl hover:border-nfd-blue/35 hover:text-nfd-blue"
                  onClick={() => {
                    moveCarousel("previous");
                  }}
                  type="button"
                >
                  <ChevronLeft
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.6}
                  />
                </button>

                <button
                  aria-label="Ver entrevistas siguientes"
                  className="glass-interactive grid size-10 place-items-center rounded-full border border-ink/10 bg-white/55 text-ink/55 backdrop-blur-xl hover:border-nfd-blue/35 hover:text-nfd-blue"
                  onClick={() => {
                    moveCarousel("next");
                  }}
                  type="button"
                >
                  <ChevronRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={1.6}
                  />
                </button>
              </div>
            </Reveal>
          ) : null}
        </div>

        {filters.filtered.length === 0 ? (
          <p className="mt-8 rounded-[1.4rem] border border-dashed border-ink/15 bg-white/40 px-6 py-10 text-center text-sm text-ink/50">
            No hay entrevistas con esta combinación de filtros.
          </p>
        ) : null}

        {/* Carrusel */}
        <div
          className="mt-8 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          ref={carouselRef}
        >
          {featuredConversations.map(
            (conversation, index) => {
              const cover = getPreferredMedia(
                conversation,
                filters.platform,
              );

              return (
                <Reveal
                  className={cn(
                    "shrink-0 snap-start",
                    platformRailWidthClasses[
                      cover.platform
                    ],
                  )}
                  delay={Math.min(
                    0.04 + index * 0.04,
                    0.24,
                  )}
                  key={conversation.slug}
                >
                  <ConversationCard
                    activeFilter={filters.platform}
                    conversation={conversation}
                  />
                </Reveal>
              );
            },
          )}
        </div>

        {/* Ver todas */}
        <div className="mt-6 flex justify-center">
          <Link
            className="glass-interactive inline-flex min-h-11 items-center gap-3 rounded-full border border-ink/15 bg-white/55 px-5 text-[0.57rem] font-semibold uppercase tracking-[0.14em] text-ink/65 backdrop-blur-xl hover:border-nfd-blue/40 hover:text-nfd-blue"
            href={getArchiveHref(
              filters.platform,
              filters.category,
            )}
          >
            Ver todas las entrevistas (
            {filters.filtered.length})
            <ArrowRight
              aria-hidden="true"
              size={15}
              strokeWidth={1.6}
            />
          </Link>
        </div>
      </Container>
    </section>
  );
}
