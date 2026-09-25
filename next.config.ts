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
    // Imágenes subidas desde el panel a Vercel Blob.
    remotePatterns: [
      {
        protocol: "https",
        hostname:
          "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
