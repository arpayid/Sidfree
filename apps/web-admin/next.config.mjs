/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/admin',
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }
};
export default nextConfig;
