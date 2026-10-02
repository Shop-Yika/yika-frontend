import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            // AWS S3 / CloudFront for product images
            {
                protocol: 'https',
                hostname: '*.amazonaws.com',
            },
            // Unsplash — used in sample/fixture data only.
            // Remove once real product images are served from S3.
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
        ],
    },
    reactCompiler: true,
};

export default nextConfig;
