import { readFile } from "node:fs/promises";
import path from "node:path";

import { getLocalUploadsDir } from "@/lib/content/storage";

/**
 * Sirve las imágenes subidas desde el panel cuando el sitio usa el
 * almacenamiento local (sin Vercel Blob).
 */

const contentTypes: Record<
  string,
  string
> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      path: string[];
    }>;
  },
) {
  const { path: segments } =
    await context.params;

  const uploadsDir = getLocalUploadsDir();

  const filePath = path.resolve(
    uploadsDir,
    ...segments,
  );

  const contentType =
    contentTypes[
      path.extname(filePath).toLowerCase()
    ];

  if (
    !filePath.startsWith(
      `${uploadsDir}${path.sep}`,
    ) ||
    !contentType
  ) {
    return new Response("No encontrado", {
      status: 404,
    });
  }

  try {
    const file = await readFile(filePath);

    return new Response(file, {
      headers: {
        "Content-Type": contentType,
        // Los nombres son únicos, así que se pueden cachear.
        "Cache-Control":
          "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("No encontrado", {
      status: 404,
    });
  }
}
