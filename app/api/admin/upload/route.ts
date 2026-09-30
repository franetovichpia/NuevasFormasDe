import { getSession } from "@/lib/auth";
import {
  allowedImageTypes,
  saveImage,
} from "@/lib/content/storage";

// Vercel acepta hasta 4,5 MB por pedido. El panel achica las
// fotos antes de subirlas, así que normalmente pesan mucho menos.
const MAX_IMAGE_SIZE = 4 * 1024 * 1024;

export async function POST(
  request: Request,
) {
  const session = await getSession();

  if (!session) {
    return Response.json(
      {
        error:
          "La sesión expiró. Volvé a ingresar.",
      },
      {
        status: 401,
      },
    );
  }

  const formData = await request
    .formData()
    .catch(() => null);

  const file = formData?.get("file");
  const folder = formData?.get("folder");

  if (!(file instanceof File)) {
    return Response.json(
      {
        error: "No se recibió ninguna imagen.",
      },
      {
        status: 400,
      },
    );
  }

  if (
    folder !== "events" &&
    folder !== "conversations"
  ) {
    return Response.json(
      {
        error: "Destino inválido.",
      },
      {
        status: 400,
      },
    );
  }

  if (!allowedImageTypes.includes(file.type)) {
    return Response.json(
      {
        error: `"${file.name}" no es una imagen JPG, PNG, WEBP, GIF o AVIF.`,
      },
      {
        status: 400,
      },
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return Response.json(
      {
        error: `"${file.name}" pesa más de 4 MB.`,
      },
      {
        status: 413,
      },
    );
  }

  try {
    const url = await saveImage({
      folder,
      fileName: file.name,
      contentType: file.type,
      bytes: await file.arrayBuffer(),
    });

    return Response.json({
      url,
    });
  } catch (error) {
    console.error(
      "Error al guardar la imagen:",
      error,
    );

    return Response.json(
      {
        error:
          "No se pudo guardar la imagen. Probá de nuevo.",
      },
      {
        status: 500,
      },
    );
  }
}
