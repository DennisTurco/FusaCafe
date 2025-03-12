import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["e7.pngegg.com", "cdn.sanity.io"], // Aggiungi il dominio da cui stai cercando di caricare l'immagine
  },
};

export default nextConfig;
