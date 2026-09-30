"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import {
  FaInstagram,
  FaSpotify,
  FaYoutube,
} from "react-icons/fa";

import type {
  Conversation,
  ConversationMedia,
  ConversationPlatform,
} from "@/data/conversations";
import { cn } from "@/utils/cn";
import { shouldOptimizeImage } from "@/utils/image";

import type { ConversationFilter } from "@/lib/conversation-filters";

export type { ConversationFilter };

type ConversationCardProps = {
  conversation: Conversation;
  activeFilter: ConversationFilter;
};

export const platformLabels: Record<
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

export const platformRailWidthClasses: Record<
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

export function getPreferredMedia(
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

export function ConversationCard({
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

