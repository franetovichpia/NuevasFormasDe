import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "127.0.0.1",
    "192.168.0.202",
  ],

  turbopack: {
    root: process.cwd(),
  },

  images: {
    // Imágenes subidas desde el panel (Vercel Blob) y desde Google Drive.
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "*.public.blob.vercel-storage.com",
      },
      // Fotos de Google Drive cargadas desde la planilla de entrevistas.
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
