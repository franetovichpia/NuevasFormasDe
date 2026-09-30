"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import {
  ConversationCard,
  type ConversationFilter,
} from "@/components/sections/conversations/conversation-card";
import {
  ConversationFilters,
  useConversationFilters,
} from "@/components/sections/conversations/conversation-filters";
import { Container } from "@/components/ui/container";
import type { Conversation } from "@/data/conversations";
import {
  getArchiveHref,
  type CategoryFilter,
} from "@/lib/conversation-filters";

type ConversationsArchiveProps = {
  conversations: readonly Conversation[];
  initialPlatform: ConversationFilter;
  initialCategory: CategoryFilter;
};

export function ConversationsArchive({
  conversations,
  initialPlatform,
  initialCategory,
}: ConversationsArchiveProps) {
  const filters = useConversationFilters(
    conversations,
    {
      platform: initialPlatform,
      category: initialCategory,
    },
  );

  // Refleja los filtros en la dirección para poder compartirla.
  function syncUrl(
    platform: ConversationFilter,
    category: CategoryFilter,
  ) {
    window.history.replaceState(
      null,
      "",
      getArchiveHref(platform, category),
    );
  }

  const trackedFilters = {
    ...filters,
    setPlatform: (
      value: ConversationFilter,
    ) => {
      filters.setPlatform(value);
      syncUrl(value, filters.category);
    },
    setCategory: (value: CategoryFilter) => {
      filters.setCategory(value);
      syncUrl(filters.platform, value);
    },
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-paper text-ink">
      <div
        aria-hidden="true"
        className="absolute -left-48 top-16 size-[34rem] rounded-full bg-nfd-cyan/10 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-48 bottom-0 size-[34rem] rounded-full bg-nfd-magenta/8 blur-[9rem]"
      />

      <Container className="relative pb-20 pt-32 sm:pb-24 sm:pt-36">
        <Link
          className="glass-interactive inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/10 bg-white/60 pl-3 pr-4 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-ink/60 backdrop-blur-xl hover:border-nfd-blue/35 hover:text-nfd-blue"
          href="/#conversaciones"
        >
          <ArrowLeft
            aria-hidden="true"
            size={16}
            strokeWidth={1.7}
          />
          Volver
        </Link>

        <Reveal>
          <p className="mt-8 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-nfd-magenta">
            Conversaciones
          </p>

          <h1 className="mt-4 font-sans text-[clamp(2.4rem,4.6vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-ink">
            Todas las entrevistas.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/55">
            Filtrá por red social o por categoría.{" "}
            {filters.filtered.length === conversations.length
              ? `${conversations.length} entrevistas publicadas.`
              : `Mostrando ${filters.filtered.length} de ${conversations.length}.`}
          </p>
        </Reveal>

        <div className="mt-8 border-y border-ink/10 py-5">
          <ConversationFilters {...trackedFilters} />
        </div>

        {filters.filtered.length === 0 ? (
          <p className="mt-8 rounded-[1.4rem] border border-dashed border-ink/15 bg-white/40 px-6 py-10 text-center text-sm text-ink/50">
            No hay entrevistas con esta combinación de filtros.
          </p>
        ) : (
          <div className="mt-8 columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
            {filters.filtered.map(
              (conversation) => (
                <div
                  className="mb-4 break-inside-avoid"
                  key={conversation.slug}
                >
                  <ConversationCard
                    activeFilter={filters.platform}
                    conversation={conversation}
                  />
                </div>
              ),
            )}
          </div>
        )}
      </Container>
    </main>
  );
}
