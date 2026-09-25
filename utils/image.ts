/**
 * Las imágenes propias (/images/...) y las subidas a Vercel Blob pasan por
 * el optimizador de Next.js. El resto (por ejemplo, un enlace externo
 * cargado desde el CSV) se muestra tal cual, sin optimizar.
 */
export function shouldOptimizeImage(
  src: string,
) {
  if (src.startsWith("/images/")) {
    return true;
  }

  try {
    return new URL(
      src,
    ).hostname.endsWith(
      ".public.blob.vercel-storage.com",
    );
  } catch {
    return false;
  }
}
