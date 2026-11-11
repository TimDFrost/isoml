import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // FlatCompat + eslint-config-next currently hits a circular JSON bug in this toolchain.
    // TypeScript checking remains enabled during `next build`.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
