import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "@ohya/shared",
    "@ohya/identity-schema",
    "@ohya/billing",
    "@ohya/ai",
  ],
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
