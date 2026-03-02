/** @type {import('next').NextConfig} */
const isStaticExport = process.env.BUILD_STATIC === '1'

const nextConfig = {
  output: isStaticExport ? 'export' : undefined,
  images: {
    unoptimized: isStaticExport,
    domains: ['localhost'],
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  env: {
    NEXT_PUBLIC_STATIC_BUILD: isStaticExport ? 'true' : 'false',
  },
  ...(isStaticExport && {
    trailingSlash: false,
  }),
}

module.exports = nextConfig
