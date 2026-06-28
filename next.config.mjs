/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone server for the Docker image; on Vercel let the platform handle output.
  output: process.env.VERCEL ? undefined : 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' },
    ],
  },
}
export default nextConfig
