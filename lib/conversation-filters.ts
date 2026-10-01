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

/**
 * Opciones de los filtros definidas en la hoja "Configuración"
 * de la planilla (nombres tal como se escribieron).
 */
export type FilterConfig = {
  categories?: readonly string[];
  platforms?: readonly string[];
};

const slugPattern = /^[a-z0-9-]{1,60}$/;

export function parsePlatformFilter(
  value: string | null | undefined,
): ConversationFilter {
  return value && slugPattern.test(value)
    ? value
    : "all";
}

export function parseCategoryFilter(
  value: string | null | undefined,
): CategoryFilter {
  return value && slugPattern.test(value)
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
