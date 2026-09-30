import { resolveCategory } from "@/data/categories";
import type {
  Conversation,
  ConversationPlatform,
} from "@/data/conversations";

/**
 * Filtros de entrevistas que se usan tanto en el servidor
 * (para leer la dirección de /entrevistas) como en el navegador.
 */

export type ConversationFilter =
  | "all"
  | ConversationPlatform;

/** "all" o el identificador (slug) de una categoría. */
export type CategoryFilter = string;

const platformValues = new Set<string>([
  "youtube",
  "instagram",
  "podcast",
]);

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
  return value && /^[a-z0-9-]{1,60}$/.test(value)
    ? value
    : "all";
}

export function hasCategory(
  conversation: Conversation,
  slug: string,
) {
  return (conversation.categories ?? []).some(
    (value) =>
      resolveCategory(value)?.slug === slug,
  );
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
