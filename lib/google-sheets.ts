import { parseCsv } from "@/lib/interviews-import";

/**
 * Lectura de una planilla de Google Sheets compartida como
 * "Cualquier persona con el enlace: Lector".
 */

export type SheetSource = {
  /** Enlace que pegaron en el panel. */
  url: string;
  /** Dirección desde la que se descarga el CSV. */
  csvUrl: string;
};

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

    return {
      url: url.toString(),
      csvUrl: csvUrl.toString(),
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
  source: SheetSource,
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
