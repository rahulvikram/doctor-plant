import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
        optimizePackageImports: [
            "lucide-react",
            "ai",
            "radix-ui",          
        ]
    }
};

export default nextConfig;
