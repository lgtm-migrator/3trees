const withTM = require('next-transpile-modules')(['three'])
const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1' },
        { key: 'Access-Control-Allow-Origin', value: 'https://giscus.app' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
      ],
    },
  ],
  webpack: config => {
    // @ts-ignore
    config.plugins.push(new WindiCSSWebpackPlugin())
    config.externals.push('sharp')
    return config
  },
  pageDataCollectionTimeout: 20000,
  staticPageGenerationTimeout: 20000,
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  rewrites: async () => [{ source: '/social.png', destination: '/api/social-image' }],
}

module.exports = withTM(nextConfig)
