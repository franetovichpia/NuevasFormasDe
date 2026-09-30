"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  ArchiveRestore,
  CalendarDays,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";
import {
  useState,
  useTransition,
} from "react";

import {
  deleteEvent,
  setEventVisibility,
} from "@/app/admin/actions";
import type {
  EventVisibility,
  NfdEvent,
} from "@/data/events";
import { cn } from "@/utils/cn";
import { shouldOptimizeImage } from "@/utils/image";

type Filter = "all" | EventVisibility;

const filters: {
  value: Filter;
  label: string;
}[] = [
  {
    value: "all",
    label: "Todos",
  },
  {
    value: "published",
    label: "Publicados",
  },
  {
    value: "draft",
    label: "Borradores",
  },
  {
    value: "archived",
    label: "Archivados",
  },
];

export const visibilityBadges: Record<
  EventVisibility,
  {
    label: string;
    className: string;
  }
> = {
  published: {
    label: "Publicado",
    className:
      "bg-emerald-100 text-emerald-800",
  },
  draft: {
    label: "Borrador",
    className: "bg-amber-100 text-amber-800",
  },
  archived: {
    label: "Archivado",
    className: "bg-ink/10 text-ink/60",
  },
};

type EventListProps = {
  events: NfdEvent[];
  canDelete: boolean;
};

export function EventList({
  events,
  canDelete,
}: EventListProps) {
  const [filter, setFilter] =
    useState<Filter>("all");

  const [error, setError] = useState<
    string | null
  >(null);

  const [pendingId, setPendingId] =
    useState<string | null>(null);

  const [, startTransition] =
    useTransition();

  const visibleEvents = events.filter(
    (event) =>
      filter === "all" ||
      event.visibility === filter,
  );

  function run(
    eventId: string,
    action: () => Promise<
      | {
          ok: true;
        }
      | {
          ok: false;
          error: string;
        }
    >,
  ) {
    setError(null);
    setPendingId(eventId);

    startTransition(async () => {
      const result = await action();

      if (!result.ok) {
        setError(result.error);
      }

      setPendingId(null);
    });
  }

  function changeVisibility(
    event: NfdEvent,
    visibility: EventVisibility,
  ) {
    run(event.id, () =>
      setEventVisibility(
        event.id,
        visibility,
      ),
    );
  }

  function remove(event: NfdEvent) {
    const confirmed = window.confirm(
      `¿Eliminar definitivamente "${event.title}"? Esta acción no se puede deshacer.`,
    );

    if (confirmed) {
      run(event.id, () =>
        deleteEvent(event.id),
      );
    }
  }

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        {filters.map((item) => {
          const count =
            item.value === "all"
              ? events.length
              : events.filter(
                  (event) =>
                    event.visibility ===
                    item.value,
                ).length;

          return (
            <button
              aria-pressed={
                filter === item.value
              }
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors",
                filter === item.value
                  ? "border-nfd-blue bg-nfd-blue text-white"
                  : "border-ink/10 bg-white text-ink/60 hover:border-nfd-blue/40",
              )}
              key={item.value}
              onClick={() => {
                setFilter(item.value);
              }}
              type="button"
            >
              {item.label} ({count})
            </button>
          );
        })}
      </div>

      {error ? (
        <p
          className="mt-4 rounded-xl bg-nfd-coral/10 px-4 py-3 text-sm text-nfd-coral"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <ul className="mt-5 space-y-3">
        {visibleEvents.length === 0 ? (
          <li className="admin-card text-sm text-ink/50">
            No hay eventos en esta lista.
          </li>
        ) : null}

        {visibleEvents.map((event) => {
          const visibility =
            event.visibility ?? "published";

          const isPending =
            pendingId === event.id;

          return (
            <li
              className={cn(
                "admin-card flex flex-col gap-4 sm:flex-row sm:items-center",
                isPending && "opacity-60",
              )}
              key={event.id}
            >
              <div className="relative h-20 w-full shrink-0 overflow-hidden rounded-xl bg-nfd-navy sm:w-28">
                {event.coverImage ? (
                  <Image
                    alt=""
                    className="object-cover"
                    fill
                    sizes="7rem"
                    src={event.coverImage}
                    unoptimized={
                      !shouldOptimizeImage(
                        event.coverImage,
                      )
                    }
                  />
                ) : (
                  <CalendarDays
                    aria-hidden="true"
                    className="absolute inset-0 m-auto text-white/70"
                    size={22}
                  />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[0.65rem] font-semibold",
                      visibilityBadges[visibility]
                        .className,
                    )}
                  >
                    {
                      visibilityBadges[visibility]
                        .label
                    }
                  </span>

                  <span className="text-[0.65rem] font-semibold uppercase tracking-[0.1em] text-ink/40">
                    {event.status === "upcoming"
                      ? "Próximo"
                      : "Realizado"}
                  </span>
                </div>

                <h2 className="mt-1.5 truncate text-lg font-semibold tracking-[-0.02em]">
                  {event.title}
                </h2>

                <p className="text-sm text-ink/50">
                  {event.date}
                  {event.location
                    ? ` · ${event.location}`
                    : ""}
                  {event.gallery.length > 0
                    ? ` · ${event.gallery.length} fotos`
                    : ""}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Link
                  className="admin-button-secondary min-h-9"
                  href={`/admin/eventos/${event.id}`}
                >
                  <Pencil
                    aria-hidden="true"
                    size={14}
                  />
                  Editar
                </Link>

                {visibility !== "published" ? (
                  <button
                    className="admin-button-secondary min-h-9"
                    disabled={isPending}
                    onClick={() => {
                      changeVisibility(
                        event,
                        "published",
                      );
                    }}
                    type="button"
                  >
                    <Eye
                      aria-hidden="true"
                      size={14}
                    />
                    Publicar
                  </button>
                ) : (
                  <button
                    className="admin-button-secondary min-h-9"
                    disabled={isPending}
                    onClick={() => {
                      changeVisibility(
                        event,
                        "draft",
                      );
                    }}
                    title="Ocultar del sitio y pasar a borrador"
                    type="button"
                  >
                    <EyeOff
                      aria-hidden="true"
                      size={14}
                    />
                    Despublicar
                  </button>
                )}

                {visibility !== "archived" ? (
                  <button
                    className="admin-button-secondary min-h-9"
                    disabled={isPending}
                    onClick={() => {
                      changeVisibility(
                        event,
                        "archived",
                      );
                    }}
                    type="button"
                  >
                    <Archive
                      aria-hidden="true"
                      size={14}
                    />
                    Archivar
                  </button>
                ) : (
                  <button
                    className="admin-button-secondary min-h-9"
                    disabled={isPending}
                    onClick={() => {
                      changeVisibility(
                        event,
                        "draft",
                      );
                    }}
                    title="Restaurar como borrador"
                    type="button"
                  >
                    <ArchiveRestore
                      aria-hidden="true"
                      size={14}
                    />
                    Restaurar
                  </button>
                )}

                {canDelete ? (
                  <button
                    className="admin-button-danger min-h-9"
                    disabled={isPending}
                    onClick={() => {
                      remove(event);
                    }}
                    type="button"
                  >
                    <Trash2
                      aria-hidden="true"
                      size={14}
                    />
                    Eliminar
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
