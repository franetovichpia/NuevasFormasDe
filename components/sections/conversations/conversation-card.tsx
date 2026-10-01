"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  Link2,
} from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaSpotify,
  FaTiktok,
  FaTwitch,
  FaVimeoV,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

import type {
  Conversation,
  ConversationMedia,
  ConversationPlatform,
} from "@/data/conversations";
import { getPlatformLabel } from "@/data/platforms";
import { cn } from "@/utils/cn";
import { shouldOptimizeImage } from "@/utils/image";

import type { ConversationFilter } from "@/lib/conversation-filters";

export type { ConversationFilter };

type ConversationCardProps = {
  conversation: Conversation;
  activeFilter: ConversationFilter;
};

type PlatformStyle = {
  badge: string;
  action: string;
  /** Formato de la imagen: "video" (16:9), "portrait" (4:5) o "square". */
  shape: "video" | "portrait" | "square";
};

function toneStyle(
  text: string,
  border: string,
  soft: string,
  solid: string,
): Pick<PlatformStyle, "badge" | "action"> {
  return {
    badge: `${border} bg-[#faf7ef]/90 ${text}`,
    action: `${border} ${soft} ${text} hover:text-white ${solid}`,
  };
}

const platformStyles: Record<
  string,
  PlatformStyle
> = {
  instagram: {
    ...toneStyle(
      "text-nfd-magenta",
      "border-nfd-magenta/25",
      "bg-nfd-magenta/10",
      "hover:border-nfd-magenta hover:bg-nfd-magenta",
    ),
    shape: "portrait",
  },
  youtube: {
    ...toneStyle(
      "text-nfd-coral",
      "border-nfd-coral/25",
      "bg-nfd-coral/10",
      "hover:border-nfd-coral hover:bg-nfd-coral",
    ),
    shape: "video",
  },
  podcast: {
    badge:
      "border-[#d9a91b]/40 bg-[#fff5ba]/90 text-[#725000]",
    action:
      "border-[#d9a91b]/30 bg-[#fff1a8]/70 text-[#725000] hover:border-[#d9a91b] hover:bg-[#d9a91b] hover:text-white",
    shape: "square",
  },
  tiktok: {
    ...toneStyle(
      "text-ink",
      "border-ink/20",
      "bg-ink/5",
      "hover:border-ink hover:bg-ink",
    ),
    shape: "portrait",
  },
  facebook: {
    ...toneStyle(
      "text-[#1877f2]",
      "border-[#1877f2]/25",
      "bg-[#1877f2]/10",
      "hover:border-[#1877f2] hover:bg-[#1877f2]",
    ),
    shape: "square",
  },
  x: {
    ...toneStyle(
      "text-ink",
      "border-ink/20",
      "bg-ink/5",
      "hover:border-ink hover:bg-ink",
    ),
    shape: "square",
  },
  twitch: {
    ...toneStyle(
      "text-[#9146ff]",
      "border-[#9146ff]/25",
      "bg-[#9146ff]/10",
      "hover:border-[#9146ff] hover:bg-[#9146ff]",
    ),
    shape: "video",
  },
  vimeo: {
    ...toneStyle(
      "text-nfd-cyan",
      "border-nfd-cyan/25",
      "bg-nfd-cyan/10",
      "hover:border-nfd-cyan hover:bg-nfd-cyan",
    ),
    shape: "video",
  },
};

// Redes nuevas cargadas desde la planilla.
const genericStyle: PlatformStyle = {
  ...toneStyle(
    "text-nfd-blue",
    "border-nfd-blue/25",
    "bg-nfd-blue/10",
    "hover:border-nfd-blue hover:bg-nfd-blue",
  ),
  shape: "square",
};

function getStyle(
  platform: ConversationPlatform,
) {
  return (
    platformStyles[platform] ?? genericStyle
  );
}

const shapeImageClasses = {
  video: "aspect-video",
  portrait: "aspect-[4/5]",
  square: "aspect-square",
} as const;

const shapeRailClasses = {
  video:
    "w-[88vw] max-w-[32rem] sm:w-[30rem]",
  portrait:
    "w-[76vw] max-w-[20rem] sm:w-[19rem]",
  square:
    "w-[76vw] max-w-[20rem] sm:w-[19rem]",
} as const;

/** Ancho de la tarjeta en el carrusel según el formato de la red. */
export function getRailWidthClass(
  platform: ConversationPlatform,
) {
  return shapeRailClasses[
    getStyle(platform).shape
  ];
}

function mediaLabel(
  media: Pick<
    ConversationMedia,
    "platform" | "platformLabel"
  >,
) {
  return getPlatformLabel(
    media.platform,
    media.platformLabel,
  );
}

const platformIcons: Record<
  string,
  typeof FaYoutube
> = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  podcast: FaSpotify,
  tiktok: FaTiktok,
  facebook: FaFacebook,
  x: FaXTwitter,
  twitch: FaTwitch,
  vimeo: FaVimeoV,
};

function PlatformIcon({
  platform,
}: {
  platform: ConversationPlatform;
}) {
  const Icon = platformIcons[platform];

  if (!Icon) {
    return (
      <Link2
        aria-hidden="true"
        size={15}
        strokeWidth={1.8}
      />
    );
  }

  return (
    <Icon
      aria-hidden="true"
      size={platform === "youtube" ? 16 : 15}
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
          shapeImageClasses[
            getStyle(cover.platform).shape
          ],
        )}
      >
        <Image
          alt={`${conversation.title} — ${mediaLabel(cover)}`}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
          fill
          loading="lazy"
          sizes={
            getStyle(cover.platform).shape ===
            "video"
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
              getStyle(cover.platform).badge,
            )}
          >
            <PlatformIcon
              platform={cover.platform}
            />

            {mediaLabel(cover)}
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
                  mediaLabel(cover)}
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
                    aria-label={`Abrir ${conversation.title} en ${mediaLabel(media)}`}
                    className={cn(
                      "grid size-8 place-items-center rounded-full border transition-all duration-300",
                      getStyle(media.platform).action,
                    )}
                    href={media.href}
                    key={`${conversation.slug}-${media.platform}-${mediaIndex}`}
                    rel="noreferrer"
                    target="_blank"
                    title={`Abrir en ${mediaLabel(media)}`}
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

