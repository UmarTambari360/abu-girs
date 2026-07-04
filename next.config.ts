import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",

  // Leaflet imports a browser-only package; suppress the server-side warning.
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig satisfies NextConfig;