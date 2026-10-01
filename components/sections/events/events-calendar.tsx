"use client";

import {
  ArrowUpRight,
  CalendarClock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import {
  useCallback,
  useMemo,
  useState,
} from "react";

import { EventModal } from "@/components/sections/events/event-modal";
import type { NfdEvent } from "@/data/events";
import {
  getTodayInArgentina,
  isIsoDate,
} from "@/lib/events";
import { cn } from "@/utils/cn";

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const shortMonthNames = [
  "ene",
  "feb",
  "mar",
  "abr",
  "may",
  "jun",
  "jul",
  "ago",
  "sep",
  "oct",
  "nov",
  "dic",
];

// La semana empieza el lunes.
const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

type YearMonth = {
  year: number;
  month: number; // 0-11
};

function toKey(
  year: number,
  month: number,
  day: number,
) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseKey(key: string) {
  const [year, month, day] = key
    .split("-")
    .map(Number);

  return {
    year,
    month: month - 1,
    day,
  };
}

/** Días (AAAA-MM-DD) que ocupa un evento, de inicio a fin. */
function getEventDays(event: NfdEvent) {
  if (!isIsoDate(event.startDate)) {
    return [];
  }

  const start = parseKey(event.startDate!);
  const endKey = isIsoDate(event.endDate)
    ? event.endDate!
    : event.startDate!;

  const days: string[] = [];
  const cursor = new Date(
    Date.UTC(start.year, start.month, start.day),
  );

  // Límite de seguridad para rangos mal cargados.
  for (let index = 0; index < 62; index++) {
    const key = toKey(
      cursor.getUTCFullYear(),
      cursor.getUTCMonth(),
      cursor.getUTCDate(),
    );

    days.push(key);

    if (key >= endKey) {
      break;
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return days;
}

function getMonthOf(
  event: NfdEvent | undefined,
  fallback: string,
): YearMonth {
  const { year, month } = parseKey(
    event && isIsoDate(event.startDate)
      ? event.startDate!
      : fallback,
  );

  return {
    year,
    month,
  };
}

/** Celdas del mes: días del mes con huecos al principio (semana desde lunes). */
function getMonthCells({
  year,
  month,
}: YearMonth) {
  const firstWeekDay =
    (new Date(
      Date.UTC(year, month, 1),
    ).getUTCDay() +
      6) %
    7;

  const daysInMonth = new Date(
    Date.UTC(year, month + 1, 0),
  ).getUTCDate();

  return [
    ...Array.from(
      {
        length: firstWeekDay,
      },
      () => null,
    ),
    ...Array.from(
      {
        length: daysInMonth,
      },
      (_, index) => index + 1,
    ),
  ];
}

/**
 * Orden cronológico: primero los próximos (del más cercano al más lejano),
 * después los realizados (del más reciente al más antiguo).
 * Los que no tienen fecha van al final de su grupo.
 */
function sortEvents(
  events: readonly NfdEvent[],
  status: NfdEvent["status"],
) {
  const direction =
    status === "upcoming" ? 1 : -1;

  return events
    .filter(
      (event) => event.status === status,
    )
    .sort((first, second) => {
      if (!first.startDate) {
        return second.startDate ? 1 : 0;
      }

      if (!second.startDate) {
        return -1;
      }

      return (
        first.startDate.localeCompare(
          second.startDate,
        ) * direction
      );
    });
}

type EventsCalendarProps = {
  events: readonly NfdEvent[];
  /**
   * Máximo de tarjetas en el listado. Si hay más, aparece
   * "Ver más eventos", que lleva a /eventos. Sin valor, se ven todas.
   */
  maxVisible?: number;
};

export function EventsCalendar({
  events,
  maxVisible,
}: EventsCalendarProps) {
  const today = getTodayInArgentina();

  const upcomingEvents = useMemo(
    () => sortEvents(events, "upcoming"),
    [events],
  );

  const pastEvents = useMemo(
    () => sortEvents(events, "past"),
    [events],
  );

  // Eventos con fecha, en orden cronológico, para las flechas del calendario.
  const datedEvents = useMemo(
    () =>
      events
        .filter((event) =>
          isIsoDate(event.startDate),
        )
        .sort((first, second) =>
          first.startDate!.localeCompare(
            second.startDate!,
          ),
        ),
    [events],
  );

  const eventsByDay = useMemo(() => {
    const map = new Map<string, NfdEvent[]>();

    for (const event of datedEvents) {
      for (const day of getEventDays(event)) {
        map.set(day, [
          ...(map.get(day) ?? []),
          event,
        ]);
      }
    }

    return map;
  }, [datedEvents]);

  // Por defecto: el próximo evento con fecha o, si no hay, el último realizado.
  const defaultEvent =
    upcomingEvents.find((event) =>
      isIsoDate(event.startDate),
    ) ??
    pastEvents.find((event) =>
      isIsoDate(event.startDate),
    ) ??
    upcomingEvents[0] ??
    pastEvents[0];

  const [selectedId, setSelectedId] =
    useState<string | null>(
      defaultEvent?.id ?? null,
    );

  const [modalEventId, setModalEventId] =
    useState<string | null>(null);


  const selectedEvent =
    events.find(
      (event) => event.id === selectedId,
    ) ?? defaultEvent;

  const visibleMonth = getMonthOf(
    selectedEvent,
    today,
  );

  const selectedDays = new Set(
    selectedEvent
      ? getEventDays(selectedEvent)
      : [],
  );

  const selectedIndex = datedEvents.findIndex(
    (event) => event.id === selectedEvent?.id,
  );

  // Listado: primero los próximos y después los realizados, hasta
  // maxVisible. El resto se ve en /eventos.
  const orderedEvents = [
    ...upcomingEvents,
    ...pastEvents,
  ];

  const hiddenCount =
    maxVisible === undefined
      ? 0
      : Math.max(
          orderedEvents.length - maxVisible,
          0,
        );

  const visibleIds = new Set(
    orderedEvents
      .slice(0, maxVisible)
      .map((event) => event.id),
  );

  const closeModal = useCallback(() => {
    setModalEventId(null);
  }, [setModalEventId]);

  const modalEvent =
    events.find(
      (event) => event.id === modalEventId,
    ) ?? null;

  function selectByOffset(offset: -1 | 1) {
    const nextEvent =
      datedEvents[selectedIndex + offset];

    if (nextEvent) {
      setSelectedId(nextEvent.id);
    }
  }

  if (events.length === 0) {
    return (
      <p className="mt-8 rounded-[1.4rem] border border-dashed border-ink/15 bg-white/40 px-6 py-10 text-center text-sm text-ink/50">
        Pronto vamos a publicar nuevos encuentros.
      </p>
    );
  }

  const cells = getMonthCells(visibleMonth);
  const selectedIsUpcoming =
    selectedEvent?.status === "upcoming";

  return (
    <>
      <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
        {/* Calendario */}
        <div className="lg:col-span-5">
          <div className="rounded-[1.4rem] border border-ink/10 bg-white/60 p-5 shadow-[0_1.25rem_3rem_rgb(28_42_54/0.08)] backdrop-blur-xl sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <button
                aria-label="Evento anterior"
                className="glass-interactive grid size-9 place-items-center rounded-full border border-ink/10 bg-white/70 text-ink/60 hover:border-nfd-blue/35 hover:text-nfd-blue disabled:pointer-events-none disabled:opacity-30"
                disabled={selectedIndex <= 0}
                onClick={() => {
                  selectByOffset(-1);
                }}
                type="button"
              >
                <ChevronLeft
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.7}
                />
              </button>

              <p
                aria-live="polite"
                className="text-center font-sans text-lg font-semibold tracking-[-0.03em]"
              >
                {monthNames[visibleMonth.month]}{" "}
                <span className="font-normal text-ink/45">
                  {visibleMonth.year}
                </span>
              </p>

              <button
                aria-label="Evento siguiente"
                className="glass-interactive grid size-9 place-items-center rounded-full border border-ink/10 bg-white/70 text-ink/60 hover:border-nfd-blue/35 hover:text-nfd-blue disabled:pointer-events-none disabled:opacity-30"
                disabled={
                  selectedIndex === -1 ||
                  selectedIndex >=
                    datedEvents.length - 1
                }
                onClick={() => {
                  selectByOffset(1);
                }}
                type="button"
              >
                <ChevronRight
                  aria-hidden="true"
                  size={17}
                  strokeWidth={1.7}
                />
              </button>
            </div>

            <div
              aria-label={`Calendario de ${monthNames[visibleMonth.month]} ${visibleMonth.year}`}
              className="mt-5 grid grid-cols-7 gap-y-1.5 text-center"
              role="group"
            >
              {weekDays.map((day, index) => (
                <span
                  className="pb-2 text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-ink/35"
                  key={`${day}-${index}`}
                  aria-hidden="true"
                >
                  {day}
                </span>
              ))}

              {cells.map((day, index) => {
                if (day === null) {
                  return (
                    <span
                      aria-hidden="true"
                      key={`empty-${index}`}
                    />
                  );
                }

                const key = toKey(
                  visibleMonth.year,
                  visibleMonth.month,
                  day,
                );

                const dayEvents =
                  eventsByDay.get(key) ?? [];

                const hasEvent =
                  dayEvents.length > 0;

                const isSelected =
                  selectedDays.has(key);

                const isUpcomingDay =
                  dayEvents.some(
                    (event) =>
                      event.status === "upcoming",
                  );

                const isToday = key === today;

                const cellClasses = cn(
                  "relative mx-auto grid size-9 place-items-center rounded-full text-sm tabular-nums transition-all duration-300 sm:size-10",
                  !hasEvent && "text-ink/30",
                  isToday &&
                    !hasEvent &&
                    "font-semibold text-ink/70 ring-1 ring-ink/20",
                  hasEvent &&
                    !isSelected &&
                    (isUpcomingDay
                      ? "bg-nfd-magenta/12 font-semibold text-nfd-magenta hover:bg-nfd-magenta/25"
                      : "bg-nfd-blue/10 font-semibold text-nfd-blue hover:bg-nfd-blue/20"),
                  isSelected &&
                    (isUpcomingDay
                      ? "scale-110 bg-nfd-magenta font-semibold text-white shadow-[0_0.5rem_1.25rem_rgb(182_0_91/0.35)]"
                      : "scale-110 bg-nfd-blue font-semibold text-white shadow-[0_0.5rem_1.25rem_rgb(0_111_152/0.35)]"),
                );

                return hasEvent ? (
                  <button
                    aria-label={`${day} de ${monthNames[visibleMonth.month]}: ${dayEvents
                      .map((event) => event.title)
                      .join(", ")}`}
                    aria-pressed={isSelected}
                    className={cellClasses}
                    key={key}
                    onClick={() => {
                      setSelectedId(
                        dayEvents[0].id,
                      );
                    }}
                    title={dayEvents
                      .map((event) => event.title)
                      .join(" · ")}
                    type="button"
                  >
                    {day}
                  </button>
                ) : (
                  <span
                    className={cellClasses}
                    key={key}
                  >
                    {day}
                  </span>
                );
              })}
            </div>

            {/* Evento seleccionado */}
            {selectedEvent ? (
              <button
                className={cn(
                  "group mt-5 flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition-colors",
                  selectedIsUpcoming
                    ? "border-nfd-magenta/25 bg-nfd-magenta/[0.06] hover:bg-nfd-magenta/10"
                    : "border-nfd-blue/20 bg-nfd-blue/[0.05] hover:bg-nfd-blue/10",
                )}
                onClick={() => {
                  setModalEventId(
                    selectedEvent.id,
                  );
                }}
                type="button"
              >
                <span className="min-w-0">
                  <span
                    className={cn(
                      "block text-[0.52rem] font-semibold uppercase tracking-[0.14em]",
                      selectedIsUpcoming
                        ? "text-nfd-magenta"
                        : "text-nfd-blue",
                    )}
                  >
                    {selectedIsUpcoming
                      ? "Próximo"
                      : "Realizado"}{" "}
                    · {selectedEvent.date}
                  </span>

                  <span className="mt-1 block truncate text-sm font-semibold">
                    {selectedEvent.title}
                  </span>
                </span>

                <span className="shrink-0 text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-ink/45 group-hover:text-ink">
                  Ver detalle
                </span>
              </button>
            ) : null}

            {!selectedEvent ||
            !isIsoDate(selectedEvent.startDate) ? (
              <p className="mt-3 flex items-center gap-2 text-xs text-ink/45">
                <CalendarClock
                  aria-hidden="true"
                  size={14}
                />
                Este evento todavía no tiene fecha confirmada.
              </p>
            ) : null}

            {/* Referencias */}
            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-ink/10 pt-4 text-[0.6rem] font-semibold uppercase tracking-[0.12em] text-ink/45">
              <span className="inline-flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-nfd-magenta" />
                Próximos
              </span>

              <span className="inline-flex items-center gap-2">
                <span className="size-2.5 rounded-full bg-nfd-blue" />
                Realizados
              </span>
            </div>
          </div>
        </div>

        {/* Listado */}
        <div className="flex flex-col gap-6 lg:col-span-7">
          {[
            {
              title: "Próximos encuentros",
              items: upcomingEvents.filter((event) =>
                visibleIds.has(event.id),
              ),
              tone: "text-nfd-magenta",
            },
            {
              title: "Eventos realizados",
              items: pastEvents.filter((event) =>
                visibleIds.has(event.id),
              ),
              tone: "text-ink/45",
            },
          ].map((group) =>
            group.items.length > 0 ? (
              <div key={group.title}>
                <p
                  className={cn(
                    "mb-3 text-[0.57rem] font-semibold uppercase tracking-[0.16em]",
                    group.tone,
                  )}
                >
                  {group.title}
                </p>

                <ul className="flex flex-col gap-2.5">
                  {group.items.map((event) => (
                    <li key={event.id}>
                      <EventRow
                        event={event}
                        isSelected={
                          event.id ===
                          selectedEvent?.id
                        }
                        onOpen={() => {
                          setSelectedId(event.id);
                          setModalEventId(event.id);
                        }}
                        onSelect={() => {
                          setSelectedId(event.id);
                        }}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}

          {hiddenCount > 0 ? (
            <Link
              className="glass-interactive inline-flex min-h-11 items-center justify-center gap-3 self-center rounded-full border border-ink/15 bg-white/55 px-5 text-[0.57rem] font-semibold uppercase tracking-[0.14em] text-ink/65 backdrop-blur-xl hover:border-nfd-blue/40 hover:text-nfd-blue"
              href="/eventos"
            >
              Ver más eventos ({hiddenCount})
              <ArrowRight
                aria-hidden="true"
                size={15}
                strokeWidth={1.6}
              />
            </Link>
          ) : null}
        </div>
      </div>

      <EventModal
        event={modalEvent}
        onClose={closeModal}
      />
    </>
  );
}

type EventRowProps = {
  event: NfdEvent;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
};

/** Tarjeta horizontal chica: fecha, título, lugar y flecha al detalle. */
function EventRow({
  event,
  isSelected,
  onSelect,
  onOpen,
}: EventRowProps) {
  const isUpcoming =
    event.status === "upcoming";

  const start = isIsoDate(event.startDate)
    ? parseKey(event.startDate!)
    : null;

  return (
    <div
      className={cn(
        "group flex items-stretch overflow-hidden rounded-[1.1rem] border bg-white/60 backdrop-blur-xl transition-all duration-300",
        isSelected
          ? isUpcoming
            ? "border-nfd-magenta/45 shadow-[0_0.9rem_2.25rem_rgb(182_0_91/0.14)]"
            : "border-nfd-blue/40 shadow-[0_0.9rem_2.25rem_rgb(0_111_152/0.13)]"
          : "border-ink/10 hover:border-ink/20 hover:bg-white/80",
      )}
    >
      <button
        aria-pressed={isSelected}
        className="flex min-w-0 flex-1 items-center gap-4 p-3 text-left sm:p-3.5"
        onClick={onSelect}
        type="button"
      >
        {/* Fecha */}
        <span
          className={cn(
            "grid size-14 shrink-0 place-items-center rounded-xl text-center leading-none",
            isUpcoming
              ? isSelected
                ? "bg-nfd-magenta text-white"
                : "bg-nfd-magenta/12 text-nfd-magenta"
              : isSelected
                ? "bg-nfd-blue text-white"
                : "bg-nfd-blue/12 text-nfd-blue",
          )}
        >
          {start ? (
            <span>
              <span className="block text-lg font-semibold tracking-[-0.03em]">
                {start.day}
              </span>
              <span className="mt-1 block text-[0.55rem] font-semibold uppercase tracking-[0.12em]">
                {shortMonthNames[start.month]}{" "}
                {String(start.year).slice(2)}
              </span>
            </span>
          ) : (
            <CalendarClock
              aria-hidden="true"
              size={20}
              strokeWidth={1.6}
            />
          )}
        </span>

        {/* Información */}
        <span className="min-w-0">
          <span
            className={cn(
              "block text-[0.52rem] font-semibold uppercase tracking-[0.14em]",
              isUpcoming
                ? "text-nfd-magenta"
                : "text-ink/40",
            )}
          >
            {isUpcoming
              ? "Será"
              : "Fue"}{" "}
            · {event.date}
          </span>

          <span className="mt-1 block truncate font-sans text-base font-semibold tracking-[-0.025em] text-ink">
            {event.title}
          </span>

          {event.location ? (
            <span className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-ink/50">
              <MapPin
                aria-hidden="true"
                className="shrink-0"
                size={12}
              />
              <span className="truncate">
                {event.location}
              </span>
            </span>
          ) : null}
        </span>
      </button>

      <button
        aria-label={`Ver detalle de ${event.title}`}
        className={cn(
          "grid w-14 shrink-0 place-items-center border-l transition-colors",
          isUpcoming
            ? "border-nfd-magenta/15 text-nfd-magenta hover:bg-nfd-magenta hover:text-white"
            : "border-ink/10 text-nfd-blue hover:bg-nfd-blue hover:text-white",
        )}
        onClick={onOpen}
        title="Ver detalle"
        type="button"
      >
        <ArrowUpRight
          aria-hidden="true"
          size={18}
          strokeWidth={1.7}
        />
      </button>
    </div>
  );
}
