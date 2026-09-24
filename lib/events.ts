import type {
  EventStatus,
  NfdEvent,
} from "@/data/events";

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

const isoDatePattern =
  /^\d{4}-\d{2}-\d{2}$/;

type DateParts = {
  year: number;
  month: number;
  day: number;
};

function parseIsoDate(
  value: string | null | undefined,
): DateParts | null {
  if (!value || !isoDatePattern.test(value)) {
    return null;
  }

  const [year, month, day] = value
    .split("-")
    .map(Number);

  return {
    year,
    month,
    day,
  };
}

export function isIsoDate(
  value: string | null | undefined,
) {
  return parseIsoDate(value) !== null;
}

/**
 * Genera textos como "24 de mayo de 2025", "24 y 25 de mayo de 2025"
 * o "30 de mayo al 2 de junio de 2025".
 */
export function formatEventDateRange(
  startDate: string | null | undefined,
  endDate?: string | null,
) {
  const start = parseIsoDate(startDate);

  if (!start) {
    return "";
  }

  const end = parseIsoDate(endDate);

  const startMonth =
    monthNames[start.month - 1];

  if (
    !end ||
    (end.year === start.year &&
      end.month === start.month &&
      end.day === start.day)
  ) {
    return `${start.day} de ${startMonth} de ${start.year}`;
  }

  const endMonth =
    monthNames[end.month - 1];

  if (
    end.year === start.year &&
    end.month === start.month
  ) {
    const joiner =
      end.day - start.day === 1
        ? "y"
        : "al";

    return `${start.day} ${joiner} ${end.day} de ${startMonth} de ${start.year}`;
  }

  if (end.year === start.year) {
    return `${start.day} de ${startMonth} al ${end.day} de ${endMonth} de ${start.year}`;
  }

  return `${start.day} de ${startMonth} de ${start.year} al ${end.day} de ${endMonth} de ${end.year}`;
}

function getTodayInArgentina() {
  // "en-CA" devuelve el formato AAAA-MM-DD.
  return new Intl.DateTimeFormat(
    "en-CA",
    {
      timeZone:
        "America/Argentina/Buenos_Aires",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    },
  ).format(new Date());
}

/**
 * Si el evento tiene fechas, se clasifica solo como próximo
 * o realizado. Si no, se usa el estado elegido en el panel.
 */
export function getEventStatus(
  event: Pick<
    NfdEvent,
    "startDate" | "endDate" | "status"
  >,
): EventStatus {
  const lastDay =
    (isIsoDate(event.endDate)
      ? event.endDate
      : null) ??
    (isIsoDate(event.startDate)
      ? event.startDate
      : null);

  if (!lastDay) {
    return event.status;
  }

  return lastDay < getTodayInArgentina()
    ? "past"
    : "upcoming";
}

export function getEventDateLabel(
  event: Pick<
    NfdEvent,
    "date" | "startDate" | "endDate"
  >,
) {
  return (
    event.date.trim() ||
    formatEventDateRange(
      event.startDate,
      event.endDate,
    ) ||
    "Fecha a confirmar"
  );
}

export function slugify(value: string) {
  return (
    value
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "sin-titulo"
  );
}
