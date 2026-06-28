/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone server for the Docker image (Render).
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
}
export default nextConfig
