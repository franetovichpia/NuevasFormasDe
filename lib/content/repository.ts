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

async function loadPublishedEvents() {
  try {
    const events = await getAllEvents();

    return events.filter(
      (event) =>
        event.visibility === "published",
    );
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

const getCachedPublishedEvents =
  unstable_cache(
    loadPublishedEvents,
    ["nfd-published-events"],
    {
      tags: [CONTENT_CACHE_TAG],
      revalidate: 300,
    },
  );

/**
 * Eventos publicados, con estado (próximo/realizado) y texto de
 * fecha ya resueltos, para mostrar en el sitio.
 */
export async function getPublishedEvents() {
  const events =
    await getCachedPublishedEvents();

  return events.map((event) => ({
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

async function loadPublicConversations() {
  try {
    return await getAllConversations();
  } catch (error) {
    console.error(
      "No se pudieron leer las entrevistas guardadas:",
      error,
    );

    return [...initialConversations];
  }
}

export const getPublicConversations =
  unstable_cache(
    loadPublicConversations,
    ["nfd-public-conversations"],
    {
      tags: [CONTENT_CACHE_TAG],
      revalidate: 300,
    },
  );
