import { randomUUID } from "node:crypto";
import {
  mkdir,
  readFile,
  rename,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

import {
  del,
  list,
  put,
} from "@vercel/blob";

/**
 * Almacenamiento del contenido editable desde el panel.
 *
 * - Con un Blob store de Vercel conectado al proyecto (variable
 *   BLOB_STORE_ID, o BLOB_READ_WRITE_TOKEN en proyectos más viejos) los
 *   datos y las imágenes se guardan en Vercel Blob. Es lo que se usa en
 *   producción.
 * - Sin esas variables se guardan en la carpeta local `.content/`
 *   (o NFD_CONTENT_DIR). Sirve para desarrollo o para un servidor propio.
 */

type ContentDocument =
  | "events"
  | "conversations";

const BLOB_CONTENT_PREFIX = "content/";
const BLOB_UPLOADS_PREFIX = "uploads/";

// Versiones anteriores que se conservan como respaldo en Vercel Blob.
const BLOB_HISTORY_SIZE = 10;

export const LOCAL_UPLOADS_ROUTE =
  "/api/uploads";

function usesBlobStorage() {
  return Boolean(
    process.env.BLOB_STORE_ID ||
      process.env.BLOB_READ_WRITE_TOKEN,
  );
}

export function getLocalContentDir() {
  return path.resolve(
    process.env.NFD_CONTENT_DIR ??
      path.join(
        process.cwd(),
        ".content",
      ),
  );
}

export function getLocalUploadsDir() {
  return path.join(
    getLocalContentDir(),
    "uploads",
  );
}

async function listBlobVersions(
  document: ContentDocument,
) {
  const prefix = `${BLOB_CONTENT_PREFIX}${document}-`;
  const blobs = [];
  let cursor: string | undefined;

  do {
    const result = await list({
      prefix,
      cursor,
    });

    blobs.push(...result.blobs);
    cursor = result.hasMore
      ? result.cursor
      : undefined;
  } while (cursor);

  return blobs.sort(
    (first, second) =>
      new Date(
        second.uploadedAt,
      ).getTime() -
      new Date(
        first.uploadedAt,
      ).getTime(),
  );
}

/**
 * Devuelve el documento guardado o `null` si todavía
 * no se guardó nada (el sitio usa entonces el contenido inicial).
 */
export async function readContentDocument<T>(
  document: ContentDocument,
): Promise<T | null> {
  if (usesBlobStorage()) {
    const [latest] =
      await listBlobVersions(document);

    if (!latest) {
      return null;
    }

    const response = await fetch(
      latest.url,
      {
        cache: "no-store",
      },
    );

    if (!response.ok) {
      throw new Error(
        `No se pudo leer ${document} (${response.status}).`,
      );
    }

    return (await response.json()) as T;
  }

  try {
    const contents = await readFile(
      path.join(
        getLocalContentDir(),
        `${document}.json`,
      ),
      "utf8",
    );

    return JSON.parse(contents) as T;
  } catch (error) {
    if (
      (error as NodeJS.ErrnoException)
        .code === "ENOENT"
    ) {
      return null;
    }

    throw error;
  }
}

export async function writeContentDocument(
  document: ContentDocument,
  data: unknown,
) {
  const body = JSON.stringify(
    data,
    null,
    2,
  );

  if (usesBlobStorage()) {
    // Cada guardado crea un archivo nuevo (con sufijo aleatorio) para
    // evitar la caché de la CDN; se lee siempre el más reciente.
    await put(
      `${BLOB_CONTENT_PREFIX}${document}-${Date.now()}.json`,
      body,
      {
        access: "public",
        addRandomSuffix: true,
        cacheControlMaxAge: 60,
        contentType:
          "application/json; charset=utf-8",
      },
    );

    const versions =
      await listBlobVersions(document);

    const outdatedVersions = versions
      .slice(BLOB_HISTORY_SIZE)
      .map((blob) => blob.url);

    if (outdatedVersions.length > 0) {
      await del(outdatedVersions);
    }

    return;
  }

  const directory =
    getLocalContentDir();

  await mkdir(directory, {
    recursive: true,
  });

  const target = path.join(
    directory,
    `${document}.json`,
  );

  const temporaryFile = `${target}.${randomUUID()}.tmp`;

  await writeFile(
    temporaryFile,
    body,
    "utf8",
  );

  await rename(temporaryFile, target);
}

const imageExtensions: Record<
  string,
  string
> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

export const allowedImageTypes =
  Object.keys(imageExtensions);

function toSafeFileName(
  fileName: string,
) {
  return (
    fileName
      .replace(/\.[^.]+$/, "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "imagen"
  );
}

/**
 * Guarda una imagen y devuelve la URL pública para usar en el sitio.
 */
export async function saveImage({
  folder,
  fileName,
  contentType,
  bytes,
}: {
  folder: "events" | "conversations";
  fileName: string;
  contentType: string;
  bytes: ArrayBuffer;
}) {
  const extension =
    imageExtensions[contentType];

  if (!extension) {
    throw new Error(
      "Formato de imagen no permitido.",
    );
  }

  const name = `${toSafeFileName(fileName)}.${extension}`;

  if (usesBlobStorage()) {
    const blob = await put(
      `${BLOB_UPLOADS_PREFIX}${folder}/${name}`,
      bytes,
      {
        access: "public",
        addRandomSuffix: true,
        contentType,
      },
    );

    return blob.url;
  }

  const directory = path.join(
    getLocalUploadsDir(),
    folder,
  );

  await mkdir(directory, {
    recursive: true,
  });

  const uniqueName = `${name.replace(/\.[^.]+$/, "")}-${randomUUID().slice(0, 8)}.${extension}`;

  await writeFile(
    path.join(directory, uniqueName),
    Buffer.from(bytes),
  );

  return `${LOCAL_UPLOADS_ROUTE}/${folder}/${uniqueName}`;
}
