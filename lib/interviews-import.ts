import {
  conversationCategories,
  conversationCategoryLabels,
  findConversationCategory,
  normalizeText,
  type ConversationCategory,
} from "@/data/categories";
import type {
  Conversation,
  ConversationMedia,
  ConversationPlatform,
} from "@/data/conversations";
import { slugify } from "@/lib/events";
import { cleanText } from "@/lib/validation";

/**
 * Importación de entrevistas desde una planilla (CSV o Excel).
 *
 * Columnas (el orden no importa, se reconocen con o sin acentos):
 * - nombre       → título de la entrevista (obligatoria)
 * - invitado     → persona entrevistada, se muestra como "Con ..." (opcional)
 * - info         → dato breve sobre el título, por ejemplo la fecha (opcional)
 * - descripcion  → texto corto debajo del título (opcional)
 * - categoria    → una o varias categorías separadas por coma (opcional)
 * - plataforma   → youtube, instagram o spotify (opcional, se deduce del link)
 * - link         → enlace a la publicación (obligatoria)
 * - foto         → URL de la imagen o nombre del archivo subido junto a la planilla
 *
 * Si una entrevista está en varias redes, se repite el mismo nombre en
 * varias filas (una por red) y se agrupan en una sola tarjeta.
 */

export type ImportField =
  | "title"
  | "guest"
  | "info"
  | "description"
  | "category"
  | "platform"
  | "link"
  | "photo";

const fieldAliases: Record<
  ImportField,
  readonly string[]
> = {
  title: [
    "nombre",
    "titulo",
    "title",
    "entrevista",
  ],
  guest: [
    "invitado",
    "invitada",
    "invitados",
    "invitadas",
    "entrevistado",
    "entrevistada",
    "guest",
  ],
  info: [
    "info",
    "informacion",
    "fecha",
    "date",
  ],
  description: [
    "descripcion",
    "description",
    "detalle",
  ],
  category: [
    "categoria",
    "categorias",
    "category",
    "categories",
  ],
  platform: [
    "plataforma",
    "red",
    "red social",
    "platform",
  ],
  link: [
    "link",
    "enlace",
    "url",
    "href",
  ],
  photo: [
    "foto",
    "imagen",
    "image",
    "portada",
    "photo",
  ],
};

export const templateHeaders = [
  "nombre",
  "invitado",
  "info",
  "descripcion",
  "categoria",
  "plataforma",
  "link",
  "foto",
] as const;

export type ImportRow = {
  rowNumber: number;
  title: string;
  slug: string;
  guest: string;
  info: string;
  description: string;
  categories: ConversationCategory[];
  platform: ConversationPlatform;
  link: string;
  /** Valor original de la columna foto. */
  photo: string;
};

export type ImportIssue = {
  rowNumber: number | null;
  message: string;
};

/* ─────────────── Lectura de CSV ─────────────── */

function detectDelimiter(text: string) {
  const firstLine =
    text.split(/\r?\n/, 1)[0] ?? "";

  const candidates = [";", ",", "\t"];

  return candidates.reduce(
    (best, candidate) =>
      firstLine.split(candidate).length >
      firstLine.split(best).length
        ? candidate
        : best,
    ",",
  );
}

/**
 * Lector de CSV compatible con lo que exportan Excel y Google Sheets:
 * separador coma, punto y coma o tabulación, y campos entre comillas.
 */
export function parseCsv(
  input: string,
): string[][] {
  const text = input.replace(/^﻿/, "");
  const delimiter = detectDelimiter(text);

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (
    let index = 0;
    index < text.length;
    index++
  ) {
    const character = text[index];

    if (inQuotes) {
      if (character === '"') {
        if (text[index + 1] === '"') {
          field += '"';
          index++;
        } else {
          inQuotes = false;
        }
      } else {
        field += character;
      }

      continue;
    }

    if (character === '"') {
      inQuotes = true;
    } else if (character === delimiter) {
      row.push(field);
      field = "";
    } else if (
      character === "\n" ||
      character === "\r"
    ) {
      if (
        character === "\r" &&
        text[index + 1] === "\n"
      ) {
        index++;
      }

      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function escapeCsvValue(
  value: string,
  delimiter: string,
) {
  if (
    value.includes(delimiter) ||
    value.includes('"') ||
    value.includes("\n") ||
    value.includes("\r")
  ) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

/**
 * Genera un CSV con punto y coma (lo que espera Excel en español)
 * y BOM para que respete los acentos.
 */
export function toCsv(
  rows: readonly (readonly string[])[],
) {
  const delimiter = ";";

  return (
    "﻿" +
    rows
      .map((row) =>
        row
          .map((value) =>
            escapeCsvValue(
              value,
              delimiter,
            ),
          )
          .join(delimiter),
      )
      .join("\r\n")
  );
}

/* ─────────────── Interpretación de filas ─────────────── */

const monthNames = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/**
 * Convierte las celdas de Excel (texto, número, fecha) a texto.
 */
export function cellToText(
  value: unknown,
): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return `${value.getUTCDate()} de ${monthNames[value.getUTCMonth()]} de ${value.getUTCFullYear()}`;
  }

  return cleanText(String(value), 2000);
}

export function detectPlatform(
  value: string,
): ConversationPlatform | null {
  const normalizedValue =
    normalizeText(value);

  if (
    ["youtube", "yt"].includes(
      normalizedValue,
    )
  ) {
    return "youtube";
  }

  if (
    ["instagram", "ig", "insta"].includes(
      normalizedValue,
    )
  ) {
    return "instagram";
  }

  if (
    ["spotify", "podcast"].includes(
      normalizedValue,
    )
  ) {
    return "podcast";
  }

  let hostname: string;

  try {
    hostname = new URL(
      value,
    ).hostname.toLowerCase();
  } catch {
    return null;
  }

  if (
    hostname.endsWith("youtube.com") ||
    hostname === "youtu.be"
  ) {
    return "youtube";
  }

  if (
    hostname.endsWith("instagram.com")
  ) {
    return "instagram";
  }

  if (
    hostname.endsWith("spotify.com") ||
    hostname === "spoti.fi" ||
    hostname.endsWith("spotify.link")
  ) {
    return "podcast";
  }

  return null;
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value);

    return (
      url.protocol === "http:" ||
      url.protocol === "https:"
    );
  } catch {
    return false;
  }
}

/**
 * La foto puede ser una URL, una ruta del sitio (/images/...)
 * o el nombre de un archivo subido junto a la planilla.
 */
export function isPhotoReference(
  value: string,
) {
  return (
    isHttpUrl(value) ||
    (value.startsWith("/") &&
      !value.startsWith("//"))
  );
}

function splitCategories(value: string) {
  return value
    .split(/[,;|/]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function interpretSheet(
  sheet: readonly (readonly unknown[])[],
): {
  rows: ImportRow[];
  issues: ImportIssue[];
} {
  const issues: ImportIssue[] = [];

  const headerIndex = sheet.findIndex(
    (row) =>
      row.some(
        (cell) =>
          cellToText(cell) !== "",
      ),
  );

  if (headerIndex === -1) {
    return {
      rows: [],
      issues: [
        {
          rowNumber: null,
          message:
            "La planilla está vacía.",
        },
      ],
    };
  }

  const headers = sheet[headerIndex].map(
    (cell) => normalizeText(cellToText(cell)),
  );

  const columns = {} as Record<
    ImportField,
    number
  >;

  for (const [field, aliases] of Object.entries(
    fieldAliases,
  ) as [ImportField, readonly string[]][]) {
    columns[field] = headers.findIndex(
      (header) => aliases.includes(header),
    );
  }

  const missingColumns = (
    ["title", "link"] as const
  ).filter(
    (field) => columns[field] === -1,
  );

  if (missingColumns.length > 0) {
    return {
      rows: [],
      issues: [
        {
          rowNumber: 1,
          message: `Faltan columnas obligatorias: ${missingColumns
            .map((field) =>
              field === "title"
                ? "nombre"
                : "link",
            )
            .join(", ")}. Encabezados esperados: ${templateHeaders.join(", ")}.`,
        },
      ],
    };
  }

  const rows: ImportRow[] = [];

  sheet
    .slice(headerIndex + 1)
    .forEach((cells, offset) => {
      const rowNumber =
        headerIndex + offset + 2;

      const read = (field: ImportField) =>
        columns[field] === -1
          ? ""
          : cellToText(
              cells[columns[field]],
            );

      const values = {
        title: read("title"),
        guest: read("guest"),
        info: read("info"),
        description: read("description"),
        category: read("category"),
        platform: read("platform"),
        link: read("link"),
        photo: read("photo"),
      };

      // Filas vacías: se ignoran.
      if (
        Object.values(values).every(
          (value) => value === "",
        )
      ) {
        return;
      }

      const rowIssues: string[] = [];

      if (!values.title) {
        rowIssues.push(
          "falta el nombre",
        );
      }

      if (!values.link) {
        rowIssues.push("falta el link");
      } else if (!isHttpUrl(values.link)) {
        rowIssues.push(
          `el link "${values.link}" no es una dirección válida (debe empezar con https://)`,
        );
      }

      const platform = values.platform
        ? detectPlatform(values.platform)
        : detectPlatform(values.link);

      if (!platform) {
        rowIssues.push(
          values.platform
            ? `plataforma "${values.platform}" desconocida (usar youtube, instagram o spotify)`
            : "no se pudo reconocer la red social del link; completar la columna plataforma",
        );
      }

      const categories: ConversationCategory[] =
        [];

      for (const name of splitCategories(
        values.category,
      )) {
        const category =
          findConversationCategory(name);

        if (!category) {
          rowIssues.push(
            `categoría "${name}" desconocida (válidas: ${conversationCategories
              .map((item) => item.label)
              .join(", ")})`,
          );
        } else if (
          !categories.includes(category)
        ) {
          categories.push(category);
        }
      }

      if (rowIssues.length > 0) {
        issues.push({
          rowNumber,
          message: rowIssues.join("; "),
        });

        return;
      }

      rows.push({
        rowNumber,
        title: values.title,
        slug: slugify(values.title),
        guest: values.guest,
        info: values.info,
        description: values.description,
        categories,
        platform: platform!,
        link: values.link,
        photo: values.photo,
      });
    });

  if (
    rows.length === 0 &&
    issues.length === 0
  ) {
    issues.push({
      rowNumber: null,
      message:
        "La planilla no tiene filas con datos.",
    });
  }

  return {
    rows,
    issues,
  };
}

/* ─────────────── Armado de entrevistas ─────────────── */

export type ResolvedImportRow = Omit<
  ImportRow,
  "photo"
> & {
  /** URL final de la imagen, o "" para conservar la anterior. */
  image: string;
};

type MutableConversation = Omit<
  Conversation,
  "media" | "categories"
> & {
  media: ConversationMedia[];
  categories: ConversationCategory[];
};

function optional(value: string) {
  return value.trim() || undefined;
}

function upsertMedia(
  media: ConversationMedia[],
  incoming: ConversationMedia,
) {
  const index = media.findIndex(
    (item) =>
      item.platform === incoming.platform,
  );

  if (index === -1) {
    media.push(incoming);
  } else {
    media[index] = {
      ...incoming,
      image:
        incoming.image ||
        media[index].image,
    };
  }
}

/**
 * Agrupa las filas por nombre y las combina con las entrevistas
 * existentes.
 *
 * - mode "merge": agrega las nuevas al principio y actualiza las que
 *   ya existen (mismo nombre), sin tocar el resto.
 * - mode "replace": la planilla pasa a ser la lista completa.
 */
export function buildConversations(
  rows: readonly ResolvedImportRow[],
  existing: readonly Conversation[],
  mode: "merge" | "replace",
): {
  conversations: Conversation[];
  created: number;
  updated: number;
  issues: ImportIssue[];
} {
  const existingBySlug = new Map(
    existing.map((conversation) => [
      conversation.slug,
      conversation,
    ]),
  );

  const imported = new Map<
    string,
    MutableConversation
  >();

  for (const row of rows) {
    const previous =
      imported.get(row.slug) ??
      (() => {
        const base =
          existingBySlug.get(row.slug);

        return {
          slug: row.slug,
          title: base?.title ?? row.title,
          guest: base?.guest,
          date: base?.date,
          description: base?.description,
          categories: [
            ...(base?.categories ?? []),
          ],
          media: [...(base?.media ?? [])],
        } satisfies MutableConversation;
      })();

    const isFirstRowForSlug =
      !imported.has(row.slug);

    const conversation: MutableConversation =
      {
        ...previous,
        title: row.title,
        guest:
          optional(row.guest) ??
          previous.guest,
        date:
          optional(row.info) ??
          previous.date,
        description:
          optional(row.description) ??
          previous.description,
        // La primera fila con categorías reemplaza las anteriores;
        // las siguientes filas de la misma entrevista las suman.
        categories:
          row.categories.length === 0
            ? previous.categories
            : isFirstRowForSlug
              ? [...row.categories]
              : [
                  ...new Set([
                    ...previous.categories,
                    ...row.categories,
                  ]),
                ],
        media: [...previous.media],
      };

    upsertMedia(conversation.media, {
      platform: row.platform,
      image: row.image,
      href: row.link,
    });

    imported.set(row.slug, conversation);
  }

  const issues: ImportIssue[] = [];

  for (const conversation of imported.values()) {
    for (const media of conversation.media) {
      if (!media.image) {
        const row = rows.find(
          (item) =>
            item.slug === conversation.slug &&
            item.platform === media.platform,
        );

        issues.push({
          rowNumber: row?.rowNumber ?? null,
          message: `"${conversation.title}" no tiene foto para ${media.platform === "podcast" ? "Spotify" : media.platform}.`,
        });
      }
    }
  }

  const importedList = [
    ...imported.values(),
  ].map(
    ({
      categories,
      ...conversation
    }): Conversation => ({
      ...conversation,
      guest: conversation.guest,
      date: conversation.date,
      description:
        conversation.description,
      categories,
    }),
  );

  const created = importedList.filter(
    (conversation) =>
      !existingBySlug.has(
        conversation.slug,
      ),
  ).length;

  if (mode === "replace") {
    return {
      conversations: importedList,
      created,
      updated:
        importedList.length - created,
      issues,
    };
  }

  const newOnes = importedList.filter(
    (conversation) =>
      !existingBySlug.has(
        conversation.slug,
      ),
  );

  const merged = existing.map(
    (conversation) =>
      imported.get(conversation.slug) ??
      conversation,
  );

  return {
    conversations: [...newOnes, ...merged],
    created,
    updated:
      importedList.length - created,
    issues,
  };
}

const platformExportLabels: Record<
  ConversationPlatform,
  string
> = {
  youtube: "youtube",
  instagram: "instagram",
  podcast: "spotify",
};

/**
 * Filas para exportar la lista actual con el mismo formato
 * que acepta la importación.
 */
export function conversationsToRows(
  conversations: readonly Conversation[],
): string[][] {
  return [
    [...templateHeaders],
    ...conversations.flatMap(
      (conversation) =>
        conversation.media.map((media) => [
          conversation.title,
          conversation.guest ?? "",
          conversation.date ?? "",
          conversation.description ?? "",
          (conversation.categories ?? [])
            .map(
              (category) =>
                conversationCategoryLabels[
                  category
                ],
            )
            .join(", "),
          platformExportLabels[
            media.platform
          ],
          media.href,
          media.image,
        ]),
    ),
  ];
}
