/**
 * Las imágenes propias (/images/...), las subidas a Vercel Blob y las de
 * Google Drive pasan por el optimizador de Next.js. El resto (por ejemplo, un enlace externo
 * cargado desde el CSV) se muestra tal cual, sin optimizar.
 */
export function shouldOptimizeImage(
  src: string,
) {
  if (src.startsWith("/images/")) {
    return true;
  }

  try {
    const { hostname } = new URL(src);

    return (
      hostname.endsWith(
        ".public.blob.vercel-storage.com",
      ) ||
      hostname === "lh3.googleusercontent.com"
    );
  } catch {
    return false;
  }
}
