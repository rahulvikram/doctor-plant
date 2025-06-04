import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: [
            "lucide-react",
            "ai",
            "radix-ui",          
        ]
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
          // Don't resolve 'fs' module on the client to prevent this error
          config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
            path: false,
          };
        }
        return config;
      },
};

export default nextConfig;
