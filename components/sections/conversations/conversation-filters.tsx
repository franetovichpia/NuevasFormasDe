"use client";

import { ChevronDown } from "lucide-react";
import {
  useId,
  useState,
} from "react";

import { conversationCategories } from "@/data/categories";
import type { Conversation } from "@/data/conversations";
import {
  parseCategoryFilter,
  parsePlatformFilter,
  type CategoryFilter,
  type ConversationFilter,
} from "@/lib/conversation-filters";
import { cn } from "@/utils/cn";

const platformOptions: {
  value: ConversationFilter;
  label: string;
}[] = [
  {
    value: "all",
    label: "Todas las redes",
  },
  {
    value: "youtube",
    label: "YouTube",
  },
  {
    value: "instagram",
    label: "Instagram",
  },
  {
    value: "podcast",
    label: "Podcast (Spotify)",
  },
];

function matchesPlatform(
  conversation: Conversation,
  filter: ConversationFilter,
) {
  return (
    filter === "all" ||
    conversation.media.some(
      (media) => media.platform === filter,
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

/**
 * Estado de los dos filtros (red social y categoría) y la lista filtrada.
 */
export function useConversationFilters(
  conversations: readonly Conversation[],
  initial: {
    platform?: ConversationFilter;
    category?: CategoryFilter;
  } = {},
) {
  const [platform, setPlatform] =
    useState<ConversationFilter>(
      initial.platform ?? "all",
    );

  const [category, setCategory] =
    useState<CategoryFilter>(
      initial.category ?? "all",
    );

  const filtered = conversations.filter(
    (conversation) =>
      matchesPlatform(conversation, platform) &&
      matchesCategory(conversation, category),
  );

  // Cada contador respeta el otro filtro activo.
  function countPlatform(
    value: ConversationFilter,
  ) {
    return conversations.filter(
      (conversation) =>
        matchesPlatform(conversation, value) &&
        matchesCategory(conversation, category),
    ).length;
  }

  function countCategory(
    value: CategoryFilter,
  ) {
    return conversations.filter(
      (conversation) =>
        matchesCategory(conversation, value) &&
        matchesPlatform(conversation, platform),
    ).length;
  }

  return {
    platform,
    setPlatform,
    category,
    setCategory,
    filtered,
    countPlatform,
    countCategory,
  };
}

type FilterSelectProps = {
  label: string;
  value: string;
  options: {
    value: string;
    label: string;
    count: number;
  }[];
  onChange: (value: string) => void;
};

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: FilterSelectProps) {
  const id = useId();
  const isFiltered = value !== "all";

  return (
    <div className="min-w-0 flex-1 sm:max-w-[17rem]">
      <label
        className="mb-1.5 block text-[0.55rem] font-semibold uppercase tracking-[0.16em] text-ink/45"
        htmlFor={id}
      >
        {label}
      </label>

      <div className="relative">
        <select
          className={cn(
            "min-h-11 w-full cursor-pointer appearance-none rounded-full border py-2 pl-4 pr-10 text-sm font-medium shadow-sm outline-none backdrop-blur-xl transition-colors focus-visible:ring-2 focus-visible:ring-nfd-blue/25",
            isFiltered
              ? "border-nfd-blue bg-nfd-blue text-white"
              : "border-ink/15 bg-white/70 text-ink/75 hover:border-nfd-blue/40",
          )}
          id={id}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          value={value}
        >
          {options.map((option) => (
            <option
              className="bg-white text-ink"
              disabled={
                option.count === 0 &&
                option.value !== value
              }
              key={option.value}
              value={option.value}
            >
              {option.label} ({option.count})
            </option>
          ))}
        </select>

        <ChevronDown
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2",
            isFiltered
              ? "text-white"
              : "text-ink/45",
          )}
          size={16}
          strokeWidth={1.8}
        />
      </div>
    </div>
  );
}

type ConversationFiltersProps = {
  platform: ConversationFilter;
  setPlatform: (
    value: ConversationFilter,
  ) => void;
  category: CategoryFilter;
  setCategory: (value: CategoryFilter) => void;
  countPlatform: (
    value: ConversationFilter,
  ) => number;
  countCategory: (
    value: CategoryFilter,
  ) => number;
  onChange?: () => void;
};

export function ConversationFilters({
  platform,
  setPlatform,
  category,
  setCategory,
  countPlatform,
  countCategory,
  onChange,
}: ConversationFiltersProps) {
  const hasFilters =
    platform !== "all" || category !== "all";

  return (
    <div
      aria-label="Filtrar entrevistas"
      className="flex flex-col gap-3 sm:flex-row sm:items-end"
      role="group"
    >
      <FilterSelect
        label="Red social"
        onChange={(value) => {
          setPlatform(
            parsePlatformFilter(value),
          );
          onChange?.();
        }}
        options={platformOptions.map(
          (option) => ({
            ...option,
            count: countPlatform(option.value),
          }),
        )}
        value={platform}
      />

      <FilterSelect
        label="Categoría"
        onChange={(value) => {
          setCategory(
            parseCategoryFilter(value),
          );
          onChange?.();
        }}
        options={[
          {
            value: "all",
            label: "Todas las categorías",
            count: countCategory("all"),
          },
          ...conversationCategories.map(
            (item) => ({
              value: item.slug,
              label: item.label,
              count: countCategory(item.slug),
            }),
          ),
        ]}
        value={category}
      />

      {hasFilters ? (
        <button
          className="min-h-11 shrink-0 rounded-full px-4 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-ink/50 transition-colors hover:text-nfd-magenta"
          onClick={() => {
            setPlatform("all");
            setCategory("all");
            onChange?.();
          }}
          type="button"
        >
          Limpiar filtros
        </button>
      ) : null}
    </div>
  );
}
