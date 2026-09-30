"use client";

const MAX_DIMENSION = 2000;
const MAX_UPLOAD_SIZE = 4 * 1024 * 1024;

/**
 * Achica fotos grandes (por ejemplo, las de un celular) antes de subirlas,
 * para que carguen rápido en el sitio y no superen el límite del servidor.
 */
async function compressImage(file: File) {
  if (
    file.type === "image/gif" ||
    typeof createImageBitmap === "undefined"
  ) {
    return file;
  }

  let bitmap: ImageBitmap;

  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(
    1,
    MAX_DIMENSION /
      Math.max(bitmap.width, bitmap.height),
  );

  if (
    scale === 1 &&
    file.size <= 1.5 * 1024 * 1024
  ) {
    bitmap.close();

    return file;
  }

  const canvas =
    document.createElement("canvas");

  canvas.width = Math.round(
    bitmap.width * scale,
  );
  canvas.height = Math.round(
    bitmap.height * scale,
  );

  const context = canvas.getContext("2d");

  if (!context) {
    bitmap.close();

    return file;
  }

  // Fondo claro por si la imagen tiene transparencias.
  context.fillStyle = "#ffffff";
  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );
  context.drawImage(
    bitmap,
    0,
    0,
    canvas.width,
    canvas.height,
  );
  bitmap.close();

  const blob = await new Promise<Blob | null>(
    (resolve) => {
      canvas.toBlob(
        resolve,
        "image/jpeg",
        0.86,
      );
    },
  );

  if (!blob || blob.size >= file.size) {
    return file;
  }

  return new File(
    [blob],
    file.name.replace(/\.[^.]+$/, "") +
      ".jpg",
    {
      type: "image/jpeg",
    },
  );
}

export async function uploadImage(
  file: File,
  folder: "events" | "conversations",
) {
  const prepared =
    await compressImage(file);

  if (prepared.size > MAX_UPLOAD_SIZE) {
    throw new Error(
      `"${file.name}" es demasiado pesada (máximo 4 MB).`,
    );
  }

  const formData = new FormData();

  formData.append("file", prepared);
  formData.append("folder", folder);

  const response = await fetch(
    "/api/admin/upload",
    {
      method: "POST",
      body: formData,
    },
  );

  const result = (await response
    .json()
    .catch(() => null)) as {
    url?: string;
    error?: string;
  } | null;

  if (!response.ok || !result?.url) {
    throw new Error(
      result?.error ??
        `No se pudo subir "${file.name}".`,
    );
  }

  return result.url;
}
