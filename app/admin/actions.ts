"use server";

import { randomUUID } from "node:crypto";

import {
  revalidatePath,
  updateTag,
} from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type {
  EventStatus,
  EventVisibility,
  NfdEvent,
} from "@/data/events";
import {
  canDeletePermanently,
  createSessionToken,
  getSession,
  isAuthConfigured,
  SESSION_COOKIE,
  verifyCredentials,
} from "@/lib/auth";
import {
  CONTENT_CACHE_TAG,
  getAllConversations,
  getAllEvents,
  saveAllConversations,
  saveAllEvents,
} from "@/lib/content/repository";
import {
  isIsoDate,
  slugify,
} from "@/lib/events";
import {
  buildConversations,
  detectPlatform,
  isHttpUrl,
  isPhotoReference,
  type ImportIssue,
  type ResolvedImportRow,
} from "@/lib/interviews-import";
import { findConversationCategory } from "@/data/categories";

export type ActionResult<T = null> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: string;
    };

function refreshPublicContent() {
  updateTag(CONTENT_CACHE_TAG);
  revalidatePath("/");
  revalidatePath("/admin", "layout");
}

async function requireActionSession() {
  const session = await getSession();

  if (!session) {
    throw new Error(
      "La sesión expiró. Volvé a ingresar.",
    );
  }

  return session;
}

function toErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Ocurrió un error inesperado.";
}

/* ─────────────── Sesión ─────────────── */

export type LoginState = {
  error: string | null;
};

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  if (!isAuthConfigured()) {
    return {
      error:
        "El acceso al panel todavía no está configurado en el servidor.",
    };
  }

  const username = String(
    formData.get("username") ?? "",
  );

  const password = String(
    formData.get("password") ?? "",
  );

  const account = verifyCredentials(
    username,
    password,
  );

  if (!account) {
    // Pequeña pausa para desalentar intentos repetidos.
    await new Promise((resolve) =>
      setTimeout(resolve, 800),
    );

    return {
      error:
        "Usuario o contraseña incorrectos.",
    };
  }

  const { token, expiresAt } =
    createSessionToken(account);

  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure:
      process.env.NODE_ENV ===
      "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  redirect("/admin");
}

export async function logout() {
  const cookieStore = await cookies();

  cookieStore.delete(SESSION_COOKIE);

  redirect("/admin/login");
}

/* ─────────────── Eventos ─────────────── */

export type EventInput = {
  id: string | null;
  title: string;
  startDate: string;
  endDate: string;
  date: string;
  location: string;
  status: EventStatus;
  href: string;
  description: string;
  coverImage: string;
  gallery: string[];
  visibility: EventVisibility;
};

const visibilities: readonly EventVisibility[] =
  ["draft", "published", "archived"];

function validateEventInput(
  input: EventInput,
): string | null {
  if (!input.title.trim()) {
    return "El evento necesita un título.";
  }

  if (input.title.length > 200) {
    return "El título es demasiado largo.";
  }

  if (
    input.startDate &&
    !isIsoDate(input.startDate)
  ) {
    return "La fecha de inicio no es válida.";
  }

  if (
    input.endDate &&
    !isIsoDate(input.endDate)
  ) {
    return "La fecha de fin no es válida.";
  }

  if (
    input.endDate &&
    !input.startDate
  ) {
    return "Completá la fecha de inicio.";
  }

  if (
    input.startDate &&
    input.endDate &&
    input.endDate < input.startDate
  ) {
    return "La fecha de fin no puede ser anterior a la de inicio.";
  }

  if (
    input.status !== "upcoming" &&
    input.status !== "past"
  ) {
    return "Estado inválido.";
  }

  if (
    !visibilities.includes(
      input.visibility,
    )
  ) {
    return "Estado de publicación inválido.";
  }

  if (
    input.href &&
    !isHttpUrl(input.href)
  ) {
    return "El enlace debe empezar con https://";
  }

  if (
    input.date.length > 120 ||
    input.location.length > 200 ||
    input.description.length > 20000
  ) {
    return "Algún campo supera el largo permitido.";
  }

  if (
    input.coverImage &&
    !isPhotoReference(input.coverImage)
  ) {
    return "La portada no es una imagen válida.";
  }

  if (
    !Array.isArray(input.gallery) ||
    input.gallery.length > 150 ||
    input.gallery.some(
      (image) =>
        typeof image !== "string" ||
        !isPhotoReference(image),
    )
  ) {
    return "Alguna foto de la galería no es válida.";
  }

  return null;
}

function getUniqueSlug(
  title: string,
  events: readonly NfdEvent[],
  currentId: string | null,
) {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;

  while (
    events.some(
      (event) =>
        event.slug === slug &&
        event.id !== currentId,
    )
  ) {
    slug = `${base}-${suffix}`;
    suffix++;
  }

  return slug;
}

export async function saveEvent(
  input: EventInput,
): Promise<
  ActionResult<{
    id: string;
  }>
> {
  try {
    const session =
      await requireActionSession();

    const validationError =
      validateEventInput(input);

    if (validationError) {
      return {
        ok: false,
        error: validationError,
      };
    }

    const events = await getAllEvents();

    const existing = input.id
      ? events.find(
          (event) => event.id === input.id,
        )
      : undefined;

    if (input.id && !existing) {
      return {
        ok: false,
        error:
          "El evento ya no existe. Recargá la página.",
      };
    }

    const id = existing?.id ?? randomUUID();

    const event: NfdEvent = {
      id,
      slug:
        existing?.slug ??
        getUniqueSlug(
          input.title,
          events,
          null,
        ),
      title: input.title.trim(),
      date: input.date.trim(),
      startDate: input.startDate || null,
      endDate: input.endDate || null,
      location:
        input.location.trim() || null,
      status: input.status,
      visibility: input.visibility,
      coverImage:
        input.coverImage || null,
      gallery: input.gallery,
      href: input.href.trim() || null,
      description:
        input.description.trim() || null,
      updatedAt: new Date().toISOString(),
    };

    const nextEvents = existing
      ? events.map((item) =>
          item.id === id ? event : item,
        )
      : [event, ...events];

    await saveAllEvents(
      nextEvents,
      session.username,
    );

    refreshPublicContent();

    return {
      ok: true,
      data: {
        id,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error),
    };
  }
}

export async function setEventVisibility(
  id: string,
  visibility: EventVisibility,
): Promise<ActionResult> {
  try {
    const session =
      await requireActionSession();

    if (
      !visibilities.includes(visibility)
    ) {
      return {
        ok: false,
        error: "Estado inválido.",
      };
    }

    const events = await getAllEvents();

    if (
      !events.some(
        (event) => event.id === id,
      )
    ) {
      return {
        ok: false,
        error: "El evento ya no existe.",
      };
    }

    await saveAllEvents(
      events.map((event) =>
        event.id === id
          ? {
              ...event,
              visibility,
              updatedAt:
                new Date().toISOString(),
            }
          : event,
      ),
      session.username,
    );

    refreshPublicContent();

    return {
      ok: true,
      data: null,
    };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error),
    };
  }
}

export async function deleteEvent(
  id: string,
): Promise<ActionResult> {
  try {
    const session =
      await requireActionSession();

    if (!canDeletePermanently(session)) {
      return {
        ok: false,
        error:
          "Solo la cuenta de administración puede eliminar eventos. Podés archivarlo.",
      };
    }

    const events = await getAllEvents();

    await saveAllEvents(
      events.filter(
        (event) => event.id !== id,
      ),
      session.username,
    );

    refreshPublicContent();

    return {
      ok: true,
      data: null,
    };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error),
    };
  }
}

/* ─────────────── Entrevistas ─────────────── */

export type ImportSummary = {
  created: number;
  updated: number;
  total: number;
};

export type ImportResult =
  | {
      ok: true;
      data: ImportSummary;
    }
  | {
      ok: false;
      error: string;
      issues?: ImportIssue[];
    };

/**
 * Revalida en el servidor las filas ya interpretadas en el navegador.
 */
function sanitizeImportRows(
  rows: unknown,
): ResolvedImportRow[] | null {
  if (
    !Array.isArray(rows) ||
    rows.length === 0 ||
    rows.length > 2000
  ) {
    return null;
  }

  const sanitized: ResolvedImportRow[] =
    [];

  for (const value of rows) {
    const row =
      value as Partial<ResolvedImportRow>;

    const text = (
      field: unknown,
      maxLength: number,
    ) =>
      typeof field === "string"
        ? field.trim().slice(0, maxLength)
        : "";

    const title = text(row.title, 200);
    const link = text(row.link, 1000);
    const image = text(row.image, 1000);

    const platform =
      typeof row.platform === "string"
        ? detectPlatform(row.platform)
        : null;

    const categories = Array.isArray(
      row.categories,
    )
      ? row.categories.map((category) =>
          typeof category === "string"
            ? findConversationCategory(
                category,
              )
            : null,
        )
      : [];

    if (
      !title ||
      !isHttpUrl(link) ||
      !platform ||
      (image && !isPhotoReference(image)) ||
      categories.some(
        (category) => category === null,
      )
    ) {
      return null;
    }

    sanitized.push({
      rowNumber:
        typeof row.rowNumber === "number"
          ? row.rowNumber
          : 0,
      title,
      slug: slugify(title),
      guest: text(row.guest, 200),
      info: text(row.info, 120),
      description: text(
        row.description,
        600,
      ),
      categories: [
        ...new Set(
          categories.filter(
            (category) => category !== null,
          ),
        ),
      ],
      platform,
      link,
      image,
    });
  }

  return sanitized;
}

export async function importInterviews(
  rows: ResolvedImportRow[],
  mode: "merge" | "replace",
): Promise<ImportResult> {
  try {
    const session =
      await requireActionSession();

    if (
      mode !== "merge" &&
      mode !== "replace"
    ) {
      return {
        ok: false,
        error: "Modo de importación inválido.",
      };
    }

    const sanitizedRows =
      sanitizeImportRows(rows);

    if (!sanitizedRows) {
      return {
        ok: false,
        error:
          "Los datos de la planilla no son válidos. Volvé a cargar el archivo.",
      };
    }

    const existing =
      await getAllConversations();

    const result = buildConversations(
      sanitizedRows,
      existing,
      mode,
    );

    if (result.issues.length > 0) {
      return {
        ok: false,
        error:
          "Hay entrevistas sin foto. Completá la columna foto.",
        issues: result.issues,
      };
    }

    await saveAllConversations(
      result.conversations,
      session.username,
    );

    refreshPublicContent();

    return {
      ok: true,
      data: {
        created: result.created,
        updated: result.updated,
        total:
          result.conversations.length,
      },
    };
  } catch (error) {
    return {
      ok: false,
      error: toErrorMessage(error),
    };
  }
}
