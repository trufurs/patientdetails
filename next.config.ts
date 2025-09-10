import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/**",
      },
    ],
    domains: ["randomuser.me"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    minimumCacheTTL: 60,
    formats: ["image/webp", "image/avif"],
  },
  /* config options here */
};

export default nextConfig;
