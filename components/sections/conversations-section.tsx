"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
} from "lucide-react";
import {
  FaInstagram,
  FaSpotify,
  FaYoutube,
} from "react-icons/fa";
import {
  useRef,
  useState,
} from "react";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import {
  conversationCategories,
  type ConversationCategory,
} from "@/data/categories";
import type {
  Conversation,
  ConversationMedia,
  ConversationPlatform,
} from "@/data/conversations";
import { cn } from "@/utils/cn";
import { shouldOptimizeImage } from "@/utils/image";

type ConversationFilter =
  | "all"
  | ConversationPlatform;

type CategoryFilter =
  | "all"
  | ConversationCategory;

type FilterOption = {
  value: ConversationFilter;
  label: string;
};

type ConversationCardProps = {
  conversation: Conversation;
  activeFilter: ConversationFilter;
};

const filters: readonly FilterOption[] = [
  {
    value: "all",
    label: "Todas",
  },
  {
    value: "instagram",
    label: "Instagram",
  },
  {
    value: "youtube",
    label: "YouTube",
  },
  {
    value: "podcast",
    label: "Podcast",
  },
];

const platformLabels: Record<
  ConversationPlatform,
  string
> = {
  instagram: "Instagram",
  youtube: "YouTube",
  podcast: "Podcast",
};

const platformBadgeClasses: Record<
  ConversationPlatform,
  string
> = {
  instagram:
    "border-nfd-magenta/30 bg-[#faf7ef]/90 text-nfd-magenta",
  youtube:
    "border-nfd-coral/30 bg-[#faf7ef]/90 text-nfd-coral",
  podcast:
    "border-[#d9a91b]/40 bg-[#fff5ba]/90 text-[#725000]",
};

const platformActionClasses: Record<
  ConversationPlatform,
  string
> = {
  instagram:
    "border-nfd-magenta/20 bg-nfd-magenta/10 text-nfd-magenta hover:border-nfd-magenta hover:bg-nfd-magenta hover:text-white",
  youtube:
    "border-nfd-coral/20 bg-nfd-coral/10 text-nfd-coral hover:border-nfd-coral hover:bg-nfd-coral hover:text-white",
  podcast:
    "border-[#d9a91b]/30 bg-[#fff1a8]/70 text-[#725000] hover:border-[#d9a91b] hover:bg-[#d9a91b] hover:text-white",
};

const platformImageClasses: Record<
  ConversationPlatform,
  string
> = {
  instagram: "aspect-[4/5]",
  youtube: "aspect-video",
  podcast: "aspect-square",
};

const platformRailWidthClasses: Record<
  ConversationPlatform,
  string
> = {
  instagram:
    "w-[76vw] max-w-[20rem] sm:w-[19rem]",
  youtube:
    "w-[88vw] max-w-[32rem] sm:w-[30rem]",
  podcast:
    "w-[76vw] max-w-[20rem] sm:w-[19rem]",
};

function PlatformIcon({
  platform,
}: {
  platform: ConversationPlatform;
}) {
  if (platform === "instagram") {
    return (
      <FaInstagram
        aria-hidden="true"
        size={15}
      />
    );
  }

  if (platform === "youtube") {
    return (
      <FaYoutube
        aria-hidden="true"
        size={16}
      />
    );
  }

  return (
    <FaSpotify
      aria-hidden="true"
      size={15}
    />
  );
}

function getPreferredMedia(
  conversation: Conversation,
  activeFilter: ConversationFilter,
): ConversationMedia {
  if (activeFilter !== "all") {
    const matchingMedia = conversation.media.find(
      (media) =>
        media.platform === activeFilter,
    );

    if (matchingMedia) {
      return matchingMedia;
    }
  }

  const preferredMedia =
    conversation.media.find(
      (media) =>
        media.platform === "youtube",
    ) ??
    conversation.media.find(
      (media) =>
        media.platform === "instagram",
    ) ??
    conversation.media[0];

  if (!preferredMedia) {
    throw new Error(
      `La conversación ${conversation.slug} no tiene imágenes.`,
    );
  }

  return preferredMedia;
}

function ConversationCard({
  conversation,
  activeFilter,
}: ConversationCardProps) {
  const cover = getPreferredMedia(
    conversation,
    activeFilter,
  );

  return (
    <article className="group relative overflow-hidden rounded-[1.4rem] border border-ink/10 bg-[#ece8df] shadow-[0_1.25rem_3rem_rgb(28_42_54/0.13)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_1.75rem_4rem_rgb(28_42_54/0.18)]">
      <div
        className={cn(
          "relative w-full overflow-hidden",
          platformImageClasses[cover.platform],
        )}
      >
        <Image
          alt={`${conversation.title} — ${platformLabels[cover.platform]}`}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          fill
          loading="lazy"
          sizes={
            cover.platform === "youtube"
              ? "(max-width: 768px) 88vw, 32rem"
              : "(max-width: 768px) 76vw, 20rem"
          }
          src={cover.image}
          unoptimized={
            !shouldOptimizeImage(
              cover.image,
            )
          }
        />

        {/* Degradado suave detrás de la franja */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-ink/20 via-ink/[0.04] to-transparent"
        />

        {/* Plataforma */}
        <div className="absolute left-3 top-3">
          <span
            className={cn(
              "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[0.5rem] font-semibold uppercase tracking-[0.13em] shadow-sm backdrop-blur-xl",
              platformBadgeClasses[
                cover.platform
              ],
            )}
          >
            <PlatformIcon
              platform={cover.platform}
            />

            {platformLabels[cover.platform]}
          </span>
        </div>

        {/* Indicador multiplataforma */}
        {conversation.media.length > 1 ? (
          <span className="absolute right-3 top-3 rounded-full border border-white/70 bg-[#faf7ef]/90 px-3 py-1.5 text-[0.48rem] font-semibold uppercase tracking-[0.12em] text-ink/55 shadow-sm backdrop-blur-xl">
            {conversation.media.length} plataformas
          </span>
        ) : null}

        {/* Franja beige glass */}
        <div className="absolute inset-x-0 bottom-0 border-t border-white/70 bg-[#f4efe6]/90 px-4 py-3.5 text-ink shadow-[0_-0.75rem_2rem_rgb(15_32_45/0.10)] backdrop-blur-xl transition-colors duration-500 group-hover:bg-[#faf7ef]/95 sm:px-5 sm:py-4">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[0.47rem] font-semibold uppercase tracking-[0.15em] text-nfd-blue/70">
                {conversation.date ??
                  platformLabels[
                    cover.platform
                  ]}
              </p>

              <h3 className="mt-1.5 line-clamp-2 font-sans text-[0.95rem] font-semibold leading-tight tracking-[-0.025em] text-ink sm:text-base">
                {conversation.title}
              </h3>

              {conversation.guest ? (
                <p className="mt-1 line-clamp-1 text-[0.68rem] text-ink/50 sm:text-xs">
                  Con {conversation.guest}
                </p>
              ) : null}

              {conversation.description ? (
                <p className="mt-1 line-clamp-2 text-[0.64rem] leading-snug text-ink/45 sm:text-[0.68rem]">
                  {conversation.description}
                </p>
              ) : null}
            </div>

            {/* Enlaces */}
            <div className="flex shrink-0 items-center gap-1.5">
              {conversation.media.map(
                (media, mediaIndex) => (
                  <a
                    aria-label={`Abrir ${conversation.title} en ${platformLabels[media.platform]}`}
                    className={cn(
                      "grid size-8 place-items-center rounded-full border transition-all duration-300",
                      platformActionClasses[
                        media.platform
                      ],
                    )}
                    href={media.href}
                    key={`${conversation.slug}-${media.platform}-${mediaIndex}`}
                    rel="noreferrer"
                    target="_blank"
                    title={`Abrir en ${platformLabels[media.platform]}`}
                  >
                    <PlatformIcon
                      platform={
                        media.platform
                      }
                    />
                  </a>
                ),
              )}

              <span
                aria-hidden="true"
                className="grid size-8 place-items-center rounded-full border border-ink/10 bg-white/45 text-ink/50"
              >
                <ArrowUpRight
                  size={13}
                  strokeWidth={1.6}
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

function matchesPlatform(
  conversation: Conversation,
  filter: ConversationFilter,
) {
  return (
    filter === "all" ||
    conversation.media.some(
      (media) =>
        media.platform === filter,
    )
  );
}

function matchesCategory(
  conversation: Conversation,
  filter: CategoryFilter,
) {
  return (
    filter === "all" ||
    (conversation.categories ?? []).includes(
      filter,
    )
  );
}

type ConversationsSectionProps = {
  conversations: readonly Conversation[];
};

export function ConversationsSection({
  conversations,
}: ConversationsSectionProps) {
  const carouselRef =
    useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] =
    useState<ConversationFilter>("all");

  const [
    activeCategory,
    setActiveCategory,
  ] = useState<CategoryFilter>("all");

  const [showAll, setShowAll] =
    useState(false);

  const filteredConversations =
    conversations.filter(
      (conversation) =>
        matchesPlatform(
          conversation,
          activeFilter,
        ) &&
        matchesCategory(
          conversation,
          activeCategory,
        ),
    );

  const featuredConversations =
    filteredConversations.slice(0, 6);

  const archiveGridClasses =
    activeFilter === "instagram" ||
    activeFilter === "podcast"
      ? "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "md:grid-cols-2 xl:grid-cols-3";

  // Cada contador respeta el otro filtro activo.
  function getFilterCount(
    filter: ConversationFilter,
  ) {
    return conversations.filter(
      (conversation) =>
        matchesPlatform(
          conversation,
          filter,
        ) &&
        matchesCategory(
          conversation,
          activeCategory,
        ),
    ).length;
  }

  function getCategoryCount(
    category: CategoryFilter,
  ) {
    return conversations.filter(
      (conversation) =>
        matchesCategory(
          conversation,
          category,
        ) &&
        matchesPlatform(
          conversation,
          activeFilter,
        ),
    ).length;
  }

  function resetCarousel() {
    setShowAll(false);

    requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({
        left: 0,
        behavior: "smooth",
      });
    });
  }

  function handleFilterChange(
    filter: ConversationFilter,
  ) {
    setActiveFilter(filter);
    resetCarousel();
  }

  function handleCategoryChange(
    category: CategoryFilter,
  ) {
    setActiveCategory(category);
    resetCarousel();
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
        <div className="mt-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <Reveal>
            <div
              aria-label="Filtrar conversaciones"
              className="flex flex-wrap gap-2"
              role="group"
            >
              {filters.map((filter) => {
                const isActive =
                  activeFilter ===
                  filter.value;

                return (
                  <button
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex min-h-10 items-center gap-3 rounded-full border px-4 text-[0.56rem] font-semibold uppercase tracking-[0.13em] transition-all duration-300",
                      isActive
                        ? "border-nfd-blue bg-nfd-blue text-white shadow-[0_0.8rem_2rem_rgb(0_111_152/0.18)]"
                        : "border-ink/10 bg-white/45 text-ink/50 backdrop-blur-xl hover:border-nfd-blue/35 hover:text-nfd-blue",
                    )}
                    key={filter.value}
                    onClick={() => {
                      handleFilterChange(
                        filter.value,
                      );
                    }}
                    type="button"
                  >
                    {filter.label}

                    <span
                      className={cn(
                        "grid min-w-6 place-items-center rounded-full px-1.5 py-1 text-[0.5rem]",
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-ink/5 text-ink/40",
                      )}
                    >
                      {getFilterCount(
                        filter.value,
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {!showAll ? (
            <Reveal delay={0.08}>
              <div className="flex items-center gap-2">
                <button
                  aria-label="Ver conversaciones anteriores"
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
                  aria-label="Ver conversaciones siguientes"
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

        {/* Filtro por categoría */}
        <Reveal delay={0.04}>
          <div className="mt-5 flex flex-col gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:items-start sm:gap-5">
            <p
              className="shrink-0 pt-2.5 text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-ink/40"
              id="conversation-categories-label"
            >
              Categorías
            </p>

            <div
              aria-labelledby="conversation-categories-label"
              className="flex flex-wrap gap-2"
              role="group"
            >
              {[
                {
                  slug: "all" as const,
                  label: "Todas",
                },
                ...conversationCategories,
              ].map((category) => {
                const isActive =
                  activeCategory ===
                  category.slug;

                const count =
                  getCategoryCount(
                    category.slug,
                  );

                const isEmpty =
                  count === 0 && !isActive;

                return (
                  <button
                    aria-pressed={isActive}
                    className={cn(
                      "inline-flex min-h-9 items-center gap-2.5 rounded-full border px-3.5 text-[0.53rem] font-semibold uppercase tracking-[0.12em] transition-all duration-300",
                      isActive
                        ? "border-nfd-magenta bg-nfd-magenta text-white shadow-[0_0.8rem_2rem_rgb(182_0_91/0.16)]"
                        : "border-ink/10 bg-white/45 text-ink/50 backdrop-blur-xl hover:border-nfd-magenta/35 hover:text-nfd-magenta",
                      isEmpty &&
                        "cursor-not-allowed opacity-45 hover:border-ink/10 hover:text-ink/50",
                    )}
                    disabled={isEmpty}
                    key={category.slug}
                    onClick={() => {
                      handleCategoryChange(
                        category.slug,
                      );
                    }}
                    type="button"
                  >
                    {category.label}

                    <span
                      className={cn(
                        "grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[0.48rem]",
                        isActive
                          ? "bg-white/15 text-white"
                          : "bg-ink/5 text-ink/40",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {filteredConversations.length === 0 ? (
          <p className="mt-8 rounded-[1.4rem] border border-dashed border-ink/15 bg-white/40 px-6 py-10 text-center text-sm text-ink/50">
            No hay entrevistas con esta combinación de filtros.
          </p>
        ) : null}

        {/* Carrusel */}
        {!showAll ? (
          <div
            className="mt-8 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain pb-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            ref={carouselRef}
          >
            {featuredConversations.map(
              (conversation, index) => {
                const cover =
                  getPreferredMedia(
                    conversation,
                    activeFilter,
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
                      activeFilter={
                        activeFilter
                      }
                      conversation={
                        conversation
                      }
                    />
                  </Reveal>
                );
              },
            )}
          </div>
        ) : (
          /* Archivo completo */
          <div
            className={cn(
              "mt-8 grid grid-cols-1 items-start gap-4",
              archiveGridClasses,
            )}
          >
            {filteredConversations.map(
              (conversation, index) => (
                <Reveal
                  className="self-start"
                  delay={Math.min(
                    0.03 +
                      index * 0.025,
                    0.2,
                  )}
                  key={conversation.slug}
                >
                  <ConversationCard
                    activeFilter={
                      activeFilter
                    }
                    conversation={
                      conversation
                    }
                  />
                </Reveal>
              ),
            )}
          </div>
        )}

        {/* Mostrar todas */}
        {filteredConversations.length > 6 ? (
          <div className="mt-6 flex justify-center">
            <button
              aria-expanded={showAll}
              className="glass-interactive inline-flex min-h-11 items-center gap-3 rounded-full border border-ink/15 bg-white/55 px-5 text-[0.57rem] font-semibold uppercase tracking-[0.14em] text-ink/65 backdrop-blur-xl hover:border-nfd-blue/40 hover:text-nfd-blue"
              onClick={() => {
                setShowAll(
                  (currentValue) =>
                    !currentValue,
                );
              }}
              type="button"
            >
              {showAll
                ? "Volver al carrusel"
                : `Ver todas (${filteredConversations.length})`}

              {showAll ? (
                <ChevronUp
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.6}
                />
              ) : (
                <ChevronDown
                  aria-hidden="true"
                  size={15}
                  strokeWidth={1.6}
                />
              )}
            </button>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
