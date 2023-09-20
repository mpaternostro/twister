/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    loader: "custom",
    loaderFile: "./other/supabase-image-loader.js",
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
