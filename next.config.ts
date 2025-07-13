import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'test.bowlersnetwork.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'pub-2def41345f13434aa37c16ee78e1fbcc.r2.dev',
                port: '',
                pathname: '/**',
            },
        ],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    turbopack: {
        // Turbopack configuration (moved from experimental.turbo)
    }
};

export default nextConfig;
