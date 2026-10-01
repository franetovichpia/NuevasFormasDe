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

export type CategoryInfo = {
  slug: string;
  label: string;
};

function toSlug(value: string) {
  return (
    normalizeText(value)
      .replace(/ /g, "-")
      .slice(0, 60) || "categoria"
  );
}

/**
 * Categoría a partir de un texto. Si coincide con una de las 9 fijas
 * devuelve esa; si no, crea una categoría nueva con el nombre tal cual
 * se escribió (así las planillas pueden sumar filtros nuevos).
 */
export function resolveCategory(
  value: string,
): CategoryInfo | null {
  const text = value
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);

  if (!normalizeText(text)) {
    return null;
  }

  const known = findConversationCategory(text);

  if (known) {
    return {
      slug: known,
      label: conversationCategoryLabels[known],
    };
  }

  return {
    slug: toSlug(text),
    label:
      text.charAt(0).toUpperCase() +
      text.slice(1),
  };
}

export function isFixedCategory(
  slug: string,
) {
  return slug in conversationCategoryLabels;
}

/**
 * Categorías para los filtros: primero las de la hoja "Configuración"
 * (o las 9 fijas si no hay) y después, en orden alfabético, las que
 * aparezcan en las entrevistas y no estén en esa lista.
 */
export function getCategoryOptions(
  conversations: readonly {
    categories?: readonly string[];
  }[],
  /** Lista de la hoja "Configuración"; si no hay, se usan las 9 fijas. */
  configured?: readonly string[],
): CategoryInfo[] {
  const base: CategoryInfo[] = [];

  for (const value of configured ?? []) {
    const category = resolveCategory(value);

    if (
      category &&
      !base.some(
        (item) => item.slug === category.slug,
      )
    ) {
      base.push(category);
    }
  }

  if (base.length === 0) {
    base.push(
      ...conversationCategories.map(
        (category) => ({
          slug: category.slug as string,
          label: category.label as string,
        }),
      ),
    );
  }

  const extra = new Map<string, string>();

  for (const conversation of conversations) {
    for (const value of conversation.categories ??
      []) {
      const category = resolveCategory(value);

      if (
        category &&
        !base.some(
          (item) => item.slug === category.slug,
        ) &&
        !extra.has(category.slug)
      ) {
        extra.set(category.slug, category.label);
      }
    }
  }

  return [
    ...base,
    ...[...extra.entries()]
      .map(([slug, label]) => ({
        slug,
        label,
      }))
      .sort((first, second) =>
        first.label.localeCompare(
          second.label,
          "es",
        ),
      ),
  ];
}
