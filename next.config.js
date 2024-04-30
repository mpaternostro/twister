/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  eslint: {
    dirs: ["app", "lib", "components", "other"], // Only run ESLint on the 'pages' and 'utils' directories during production builds (next build)
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
