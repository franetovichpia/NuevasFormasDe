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
 * Lecturas en caché: el almacenamiento se consulta solo la primera vez y
 * después de cada guardado desde el panel (que invalida CONTENT_CACHE_TAG).
 * Así se evita consultar Vercel Blob en cada visita: el plan gratuito tiene
 * un límite mensual de operaciones.
 *
 * Si la lectura falla, el error no se guarda en caché: se muestra el
 * contenido inicial y se vuelve a intentar en la próxima visita.
 */
const cacheOptions = {
  tags: [CONTENT_CACHE_TAG],
  revalidate: false as const,
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

/** Entrevistas publicadas, para el sitio y el panel. */
export async function getPublicConversations() {
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
