export const conversationCategories = [
  {
    slug: "iniciativas",
    label: "Iniciativas",
  },
  {
    slug: "integridades",
    label: "Integridades",
  },
  {
    slug: "formacion",
    label: "Formación",
  },
  {
    slug: "sistemas",
    label: "Sistemas",
  },
  {
    slug: "energias",
    label: "Energías",
  },
  {
    slug: "nutricion",
    label: "Nutrición",
  },
  {
    slug: "tejidos",
    label: "Tejidos",
  },
  {
    slug: "arquitectura",
    label: "Arquitectura",
  },
  {
    slug: "filosofia-tao",
    label: "Filosofía TAO",
  },
] as const;

export type ConversationCategory =
  (typeof conversationCategories)[number]["slug"];

export const conversationCategoryLabels =
  Object.fromEntries(
    conversationCategories.map(
      (category) => [
        category.slug,
        category.label,
      ],
    ),
  ) as Record<ConversationCategory, string>;

/**
 * Normaliza un texto para compararlo sin
 * acentos, mayúsculas ni espacios extra.
 */
export function normalizeText(
  value: string,
) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

/**
 * Convierte "Filosofía TAO", "filosofia tao"
 * o "filosofia-tao" en la categoría correspondiente.
 */
export function findConversationCategory(
  value: string,
): ConversationCategory | null {
  const normalizedValue =
    normalizeText(value);

  if (!normalizedValue) {
    return null;
  }

  const category =
    conversationCategories.find(
      (item) =>
        normalizeText(item.slug) ===
          normalizedValue ||
        normalizeText(item.label) ===
          normalizedValue,
    ) ??
    // Permite escribir solo "TAO" o "Filosofía".
    conversationCategories.find(
      (item) =>
        normalizeText(item.label)
          .split(" ")
          .includes(normalizedValue),
    );

  return category?.slug ?? null;
}
