/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'export',
  basePath: '/Yak-LiZa-Project',
  assetPrefix: '/Yak-LiZa-Project/',
}

export default nextConfig