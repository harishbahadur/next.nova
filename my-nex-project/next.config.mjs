/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for kuroshiro/kuromoji in production
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      crypto: false,
    };

    // Ensure .wasm files are handled correctly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Handle WASM files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "webassembly/async",
    });

    return config;
  },
  // Optimize for Vercel deployment
  experimental: {
    serverComponentsExternalPackages: [
      "kuroshiro",
      "kuroshiro-analyzer-kuromoji",
    ],
  },
};

export default nextConfig;
