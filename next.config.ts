import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["e7.pngegg.com", "cdn.sanity.io"], 
  },
};

export default nextConfig;
