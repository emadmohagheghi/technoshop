import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "https",
        hostname: "ehmhqxzbdyspniaklgld.supabase.co",
      }
    ],
  },
};

export default nextConfig;
