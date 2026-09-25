import {
  conversationCategories,
  type ConversationCategory,
} from "@/data/categories";
import type { ConversationPlatform } from "@/data/conversations";

/**
 * Filtros de entrevistas que se usan tanto en el servidor
 * (para leer la dirección de /entrevistas) como en el navegador.
 */

export type ConversationFilter =
  | "all"
  | ConversationPlatform;

export type CategoryFilter =
  | "all"
  | ConversationCategory;

const platformValues = new Set<string>([
  "youtube",
  "instagram",
  "podcast",
]);

const categoryValues = new Set<string>(
  conversationCategories.map(
    (category) => category.slug,
  ),
);

export function parsePlatformFilter(
  value: string | null | undefined,
): ConversationFilter {
  return value && platformValues.has(value)
    ? (value as ConversationPlatform)
    : "all";
}

export function parseCategoryFilter(
  value: string | null | undefined,
): CategoryFilter {
  return value && categoryValues.has(value)
    ? (value as ConversationCategory)
    : "all";
}

/**
 * Arma el enlace a /entrevistas conservando los filtros elegidos.
 */
export function getArchiveHref(
  platform: ConversationFilter,
  category: CategoryFilter,
) {
  const params = new URLSearchParams();

  if (platform !== "all") {
    params.set("red", platform);
  }

  if (category !== "all") {
    params.set("categoria", category);
  }

  const query = params.toString();

  return query
    ? `/entrevistas?${query}`
    : "/entrevistas";
}
