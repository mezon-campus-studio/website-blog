import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  turbopack: {
    root: path.resolve(process.cwd(), "../../"),
  },
  async rewrites() {
    return [
      {
        source: '/memorizz-api/:path*',
        destination: 'https://memorizz-api.onrender.com/api/:path*',
      },
    ];
  },
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'images.pexels.com', pathname: '/**' },
      { protocol: 'https', hostname: 'plus.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ui-avatars.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
};

export default nextConfig;
