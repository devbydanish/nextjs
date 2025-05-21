import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'strapi.lust66.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
