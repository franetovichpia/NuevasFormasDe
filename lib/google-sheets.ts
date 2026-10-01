import { normalizeText } from "@/data/categories";
import type { FilterConfig } from "@/lib/conversation-filters";
import {
  cellToText,
  parseCsv,
} from "@/lib/interviews-import";

/**
 * Lectura de una planilla de Google Sheets compartida como
 * "Cualquier persona con el enlace: Lector".
 */

export type SheetSource = {
  /** Enlace que pegaron en el panel. */
  url: string;
  /** Dirección desde la que se descarga el CSV. */
  csvUrl: string;
  /** Direcciones posibles de la hoja "Configuración" (opcional). */
  configCsvUrls: string[];
};

// Nombres aceptados para la hoja de configuración.
const CONFIG_SHEET_NAMES = [
  "Configuración",
  "Configuracion",
  "Config",
];

const GOOGLE_HOST = "docs.google.com";

/**
 * Solo para pruebas locales: permite leer un CSV desde
 * http://127.0.0.1 (nunca se usa en producción).
 */
function allowsLocalSource() {
  return (
    process.env.NFD_ALLOW_LOCAL_SHEET_URL ===
    "1"
  );
}

/**
 * Acepta el enlace normal de la planilla
 * (…/spreadsheets/d/ID/edit#gid=0) o el de "Publicar en la web"
 * (…/spreadsheets/d/e/ID/pub?…) y devuelve el enlace de descarga CSV.
 */
export function parseSheetUrl(
  input: string,
): SheetSource | null {
  let url: URL;

  try {
    url = new URL(input.trim());
  } catch {
    return null;
  }

  if (
    allowsLocalSource() &&
    url.protocol === "http:" &&
    url.hostname === "127.0.0.1"
  ) {
    return {
      url: url.toString(),
      csvUrl: url.toString(),
      configCsvUrls: [
        new URL("config.csv", url).toString(),
      ],
    };
  }

  if (
    url.protocol !== "https:" ||
    url.hostname !== GOOGLE_HOST
  ) {
    return null;
  }

  const gid =
    url.searchParams.get("gid") ??
    new URLSearchParams(
      url.hash.replace(/^#/, ""),
    ).get("gid");

  // Planilla publicada en la web.
  const published = url.pathname.match(
    /^\/spreadsheets\/d\/e\/([\w-]+)\/pub/,
  );

  if (published) {
    const csvUrl = new URL(
      `https://${GOOGLE_HOST}/spreadsheets/d/e/${published[1]}/pub`,
    );

    csvUrl.searchParams.set("output", "csv");

    if (gid) {
      csvUrl.searchParams.set("gid", gid);
    }

    // Las planillas "publicadas en la web" no permiten leer otra hoja
    // por nombre: la hoja de configuración no está disponible.
    return {
      url: url.toString(),
      csvUrl: csvUrl.toString(),
      configCsvUrls: [],
    };
  }

  // Enlace normal para compartir.
  const shared = url.pathname.match(
    /^\/spreadsheets\/d\/([\w-]+)/,
  );

  if (!shared) {
    return null;
  }

  const csvUrl = new URL(
    `https://${GOOGLE_HOST}/spreadsheets/d/${shared[1]}/export`,
  );

  csvUrl.searchParams.set("format", "csv");

  if (gid) {
    csvUrl.searchParams.set("gid", gid);
  }

  return {
    url: url.toString(),
    csvUrl: csvUrl.toString(),
    configCsvUrls: CONFIG_SHEET_NAMES.map(
      (name) => {
        const configUrl = new URL(
          `https://${GOOGLE_HOST}/spreadsheets/d/${shared[1]}/gviz/tq`,
        );

        configUrl.searchParams.set(
          "tqx",
          "out:csv",
        );
        configUrl.searchParams.set(
          "sheet",
          name,
        );
        configUrl.searchParams.set(
          "headers",
          "1",
        );

        return configUrl.toString();
      },
    ),
  };
}

/**
 * Convierte enlaces de Google Drive a una dirección de imagen directa.
 * El archivo tiene que estar compartido como "Cualquier persona con el enlace".
 */
export function toDirectImageUrl(
  value: string,
) {
  let url: URL;

  try {
    url = new URL(value);
  } catch {
    return value;
  }

  if (
    url.hostname !== "drive.google.com" &&
    url.hostname !== "docs.google.com"
  ) {
    return value;
  }

  const fileId =
    url.pathname.match(
      /\/file\/d\/([\w-]+)/,
    )?.[1] ?? url.searchParams.get("id");

  return fileId
    ? `https://lh3.googleusercontent.com/d/${fileId}=w1600`
    : value;
}

export class SheetAccessError extends Error {}

/**
 * Descarga la planilla y devuelve sus filas.
 */
export async function fetchSheetRows(
  source: Pick<SheetSource, "csvUrl">,
): Promise<string[][]> {
  let response: Response;

  try {
    response = await fetch(source.csvUrl, {
      cache: "no-store",
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new SheetAccessError(
      "No se pudo conectar con Google Sheets. Probá de nuevo en unos minutos.",
    );
  }

  const contentType =
    response.headers.get("content-type") ??
    "";

  // Si la planilla no es pública, Google devuelve la página de inicio de sesión.
  if (
    !response.ok ||
    contentType.includes("text/html")
  ) {
    throw new SheetAccessError(
      "No se pudo leer la planilla. Revisá que esté compartida como “Cualquier persona con el enlace: Lector”.",
    );
  }

  const text = await response.text();

  if (text.length > 2_000_000) {
    throw new SheetAccessError(
      "La planilla es demasiado grande.",
    );
  }

  return parseCsv(text);
}

const configColumns = {
  categories: [
    "categorias",
    "categoria",
    "categories",
    "temas",
  ],
  platforms: [
    "redes",
    "red",
    "redes sociales",
    "plataformas",
    "plataforma",
  ],
} as const;

/** Columnas que indican que es la hoja de entrevistas y no la de configuración. */
const interviewColumns = [
  "link",
  "nombre",
  "foto",
];

function readConfigRows(
  rows: readonly (readonly unknown[])[],
): FilterConfig | null {
  const headerIndex = rows.findIndex((row) =>
    row.some((cell) => cellToText(cell)),
  );

  if (headerIndex === -1) {
    return null;
  }

  const headers = rows[headerIndex].map(
    (cell) => normalizeText(cellToText(cell)),
  );

  if (
    headers.some((header) =>
      interviewColumns.includes(header),
    )
  ) {
    return null;
  }

  const read = (
    aliases: readonly string[],
  ) => {
    const column = headers.findIndex(
      (header) => aliases.includes(header),
    );

    if (column === -1) {
      return undefined;
    }

    const values = rows
      .slice(headerIndex + 1)
      .map((row) =>
        cellToText(row[column]).slice(0, 40),
      )
      .filter(Boolean);

    return values.length > 0
      ? [...new Set(values)].slice(0, 100)
      : undefined;
  };

  const config: FilterConfig = {
    categories: read(
      configColumns.categories,
    ),
    platforms: read(configColumns.platforms),
  };

  return config.categories || config.platforms
    ? config
    : null;
}

/**
 * Lee la hoja "Configuración" (opcional) con las listas de
 * categorías y redes para los filtros. Si no existe, devuelve null.
 */
export async function fetchSheetConfig(
  source: SheetSource,
): Promise<FilterConfig | null> {
  for (const csvUrl of source.configCsvUrls) {
    try {
      const config = readConfigRows(
        await fetchSheetRows({
          csvUrl,
        }),
      );

      if (config) {
        return config;
      }
    } catch {
      // Se prueba con el siguiente nombre posible.
    }
  }

  return null;
}
