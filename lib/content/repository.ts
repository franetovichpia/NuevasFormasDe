import { unstable_cache } from "next/cache";

import {
  conversations as initialConversations,
  type Conversation,
} from "@/data/conversations";
import {
  nfdEvents as initialEvents,
  type NfdEvent,
} from "@/data/events";
import {
  readContentDocument,
  writeContentDocument,
} from "@/lib/content/storage";
import {
  getEventDateLabel,
  getEventStatus,
} from "@/lib/events";
import { resolveCategory } from "@/data/categories";
import { resolvePlatformName } from "@/data/platforms";
import type { FilterConfig } from "@/lib/conversation-filters";
import {
  fetchSheetConfig,
  fetchSheetRows,
  parseSheetUrl,
  SheetAccessError,
  toDirectImageUrl,
} from "@/lib/google-sheets";
import {
  buildConversations,
  interpretSheet,
  isPhotoReference,
  type ImportIssue,
  type ResolvedImportRow,
} from "@/lib/interviews-import";

export const CONTENT_CACHE_TAG =
  "nfd-content";

type StoredDocument<T> = {
  updatedAt: string;
  updatedBy?: string;
  items: T[];
};

function normalizeEvent(
  event: NfdEvent,
): NfdEvent {
  return {
    ...event,
    id: event.id || event.slug,
    visibility:
      event.visibility ?? "published",
    gallery: event.gallery ?? [],
  };
}

/* ─────────────── Eventos ─────────────── */

export async function getAllEvents() {
  const stored =
    await readContentDocument<
      StoredDocument<NfdEvent>
    >("events");

  const events =
    stored?.items ?? initialEvents;

  return events.map(normalizeEvent);
}

export async function saveAllEvents(
  events: readonly NfdEvent[],
  updatedBy: string,
) {
  const document: StoredDocument<NfdEvent> = {
    updatedAt: new Date().toISOString(),
    updatedBy,
    items: events.map(normalizeEvent),
  };

  await writeContentDocument(
    "events",
    document,
  );
}

/*
 * Lecturas en caché: el almacenamiento se consulta después de cada
 * guardado desde el panel (que invalida CONTENT_CACHE_TAG) y, como
 * resguardo, una vez por día. Así se evita consultar Vercel Blob en cada
 * visita: el plan gratuito tiene un límite mensual de operaciones.
 *
 * Si la lectura falla, el error no se guarda en caché: se muestra el
 * contenido inicial y se vuelve a intentar en la próxima visita.
 */
const cacheOptions = {
  tags: [CONTENT_CACHE_TAG],
  revalidate: 60 * 60 * 24,
};

const readCachedEvents = unstable_cache(
  () => getAllEvents(),
  ["nfd-events"],
  cacheOptions,
);

/** Todos los eventos (incluidos borradores y archivados), para el panel. */
export async function getCachedAllEvents() {
  try {
    return await readCachedEvents();
  } catch (error) {
    console.error(
      "No se pudieron leer los eventos guardados:",
      error,
    );

    return initialEvents.map(
      normalizeEvent,
    );
  }
}

/**
 * Eventos publicados, con estado (próximo/realizado) y texto de
 * fecha ya resueltos, para mostrar en el sitio.
 */
export async function getPublishedEvents() {
  const events = await getCachedAllEvents();

  return events
    .filter(
      (event) =>
        event.visibility === "published",
    )
    .map((event) => ({
      ...event,
      date: getEventDateLabel(event),
      status: getEventStatus(event),
    }));
}

/* ─────────────── Entrevistas ─────────────── */

export async function getAllConversations(): Promise<
  Conversation[]
> {
  const stored =
    await readContentDocument<
      StoredDocument<Conversation>
    >("conversations");

  return [
    ...(stored?.items ??
      initialConversations),
  ];
}

export async function saveAllConversations(
  conversations: readonly Conversation[],
  updatedBy: string,
) {
  const document: StoredDocument<Conversation> =
    {
      updatedAt:
        new Date().toISOString(),
      updatedBy,
      items: [...conversations],
    };

  await writeContentDocument(
    "conversations",
    document,
  );
}

const readCachedConversations =
  unstable_cache(
    () => getAllConversations(),
    ["nfd-conversations"],
    cacheOptions,
  );

/** Entrevistas guardadas desde el panel (importación de Excel/CSV). */
async function getStoredConversations() {
  try {
    return await readCachedConversations();
  } catch (error) {
    console.error(
      "No se pudieron leer las entrevistas guardadas:",
      error,
    );

    return [...initialConversations];
  }
}

/* ─────────────── Configuración ─────────────── */

export type SiteSettings = {
  /** Planilla de Google Sheets con las entrevistas (opcional). */
  interviewsSheetUrl?: string | null;
  updatedAt?: string;
  updatedBy?: string;
};

export async function getSettings(): Promise<SiteSettings> {
  return (
    (await readContentDocument<SiteSettings>(
      "settings",
    )) ?? {}
  );
}

export async function saveSettings(
  settings: SiteSettings,
  updatedBy: string,
) {
  await writeContentDocument("settings", {
    ...settings,
    updatedAt: new Date().toISOString(),
    updatedBy,
  });
}

const readCachedSettings = unstable_cache(
  () => getSettings(),
  ["nfd-settings"],
  cacheOptions,
);

export async function getCachedSettings(): Promise<SiteSettings> {
  try {
    return await readCachedSettings();
  } catch (error) {
    console.error(
      "No se pudo leer la configuración:",
      error,
    );

    return {};
  }
}

/* ─────────────── Entrevistas desde Google Sheets ─────────────── */

export const SHEET_CACHE_TAG =
  "nfd-interviews-sheet";

// Cada cuánto se vuelve a leer la planilla (en segundos).
export const SHEET_REFRESH_SECONDS = 300;

export type SheetReadResult = {
  conversations: Conversation[];
  /** Hoja "Configuración" (categorías y redes de los filtros), si existe. */
  config: FilterConfig | null;
  rowCount: number;
  issues: ImportIssue[];
  fetchedAt: string;
};

/**
 * Lee la planilla y arma las entrevistas con el mismo formato que la
 * importación. Las filas con errores se saltean y se informan en el panel.
 * Si una fila no tiene foto, se usa la de la entrevista ya guardada con el
 * mismo nombre y red (si existe).
 */
export async function readInterviewsFromSheet(
  url: string,
): Promise<SheetReadResult> {
  const source = parseSheetUrl(url);

  if (!source) {
    throw new SheetAccessError(
      "El enlace no es de una planilla de Google Sheets.",
    );
  }

  const [sheet, config] = await Promise.all([
    fetchSheetRows(source),
    fetchSheetConfig(source),
  ]);

  const { rows, issues } = interpretSheet(
    sheet,
    {
      // Las redes de la configuración también se reconocen por el link.
      platforms: (config?.platforms ?? [])
        .map((name) =>
          resolvePlatformName(name),
        )
        .filter(
          (platform) => platform !== null,
        ),
    },
  );
  const allIssues: ImportIssue[] = [...issues];
  const resolvedRows: ResolvedImportRow[] = [];

  // Si la hoja "Configuración" tiene categorías, solo se aceptan esas:
  // las demás se ignoran y se informan en el panel.
  const allowedCategories = config?.categories
    ? new Map(
        config.categories
          .map((name) => resolveCategory(name))
          .filter(
            (category) => category !== null,
          )
          .map((category) => [
            category.slug,
            category.label,
          ]),
      )
    : null;

  for (const row of rows) {
    if (allowedCategories) {
      const accepted: string[] = [];

      for (const name of row.categories) {
        const slug = resolveCategory(name)?.slug;
        const label = slug
          ? allowedCategories.get(slug)
          : undefined;

        if (label) {
          accepted.push(label);
        } else {
          allIssues.push({
            rowNumber: row.rowNumber,
            message: `“${row.title}”: la categoría “${name}” no está en la hoja Configuración (se publica sin esa categoría).`,
          });
        }
      }

      row.categories = accepted;
    }

    const { photo, ...rest } = row;
    const value = photo.trim();

    if (value && !isPhotoReference(value)) {
      allIssues.push({
        rowNumber: row.rowNumber,
        message: `“${row.title}”: la foto tiene que ser un enlace (por ejemplo, de Google Drive), no un nombre de archivo.`,
      });

      continue;
    }

    resolvedRows.push({
      ...rest,
      image: value
        ? toDirectImageUrl(value)
        : "",
    });
  }

  const built = buildConversations(
    resolvedRows,
    await getStoredConversations(),
    "replace",
  );

  // Las redes sin foto no se muestran (quedan informadas como error).
  const conversations = built.conversations
    .map((conversation) => ({
      ...conversation,
      media: conversation.media.filter(
        (media) => media.image,
      ),
    }))
    .filter(
      (conversation) =>
        conversation.media.length > 0,
    );

  return {
    conversations,
    config,
    rowCount: rows.length,
    issues: [...allIssues, ...built.issues],
    fetchedAt: new Date().toISOString(),
  };
}

const readCachedSheet = unstable_cache(
  (url: string) => readInterviewsFromSheet(url),
  ["nfd-interviews-sheet"],
  {
    tags: [SHEET_CACHE_TAG, CONTENT_CACHE_TAG],
    revalidate: SHEET_REFRESH_SECONDS,
  },
);

export type SheetStatus =
  | {
      connected: false;
    }
  | {
      connected: true;
      url: string;
      ok: true;
      result: SheetReadResult;
    }
  | {
      connected: true;
      url: string;
      ok: false;
      error: string;
    };

/** Estado de la planilla conectada, para el panel. */
export async function getSheetStatus(): Promise<SheetStatus> {
  const { interviewsSheetUrl } =
    await getCachedSettings();

  if (!interviewsSheetUrl) {
    return {
      connected: false,
    };
  }

  try {
    return {
      connected: true,
      url: interviewsSheetUrl,
      ok: true,
      result: await readCachedSheet(
        interviewsSheetUrl,
      ),
    };
  } catch (error) {
    return {
      connected: true,
      url: interviewsSheetUrl,
      ok: false,
      error:
        error instanceof SheetAccessError
          ? error.message
          : "No se pudo leer la planilla.",
    };
  }
}

/**
 * Entrevistas que se muestran en el sitio: las de la planilla de Google
 * Sheets si hay una conectada; si no (o si falla), las guardadas desde el panel.
 */
export async function getPublicConversations(): Promise<
  Conversation[]
> {
  const { interviewsSheetUrl } =
    await getCachedSettings();

  if (interviewsSheetUrl) {
    try {
      const result = await readCachedSheet(
        interviewsSheetUrl,
      );

      if (result.conversations.length > 0) {
        return result.conversations;
      }
    } catch (error) {
      console.error(
        "No se pudo leer la planilla de entrevistas:",
        error,
      );
    }
  }

  return getStoredConversations();
}

/**
 * Opciones de los filtros definidas en la hoja "Configuración" de la
 * planilla conectada. Sin planilla (o sin esa hoja) se usan las de siempre.
 */
export async function getInterviewsFilterConfig(): Promise<FilterConfig> {
  const status = await getSheetStatus();

  return status.connected && status.ok
    ? (status.result.config ?? {})
    : {};
}
