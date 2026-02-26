import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Allow all HTTPS images (adjust for production)
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  reactCompiler: true,
};

export default nextConfig;
