const WindiCSSWebpackPlugin = require('windicss-webpack-plugin')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  headers : async () => [{
    source : '/(.*)',
    headers : [
      {key : 'X-Frame-Options', value : 'DENY'},
      {key : 'X-XSS-Protection', value : '1'},
      {key : 'Access-Control-Allow-Origin', value : 'https://giscus.app'},
      {key : 'X-Content-Type-Options', value : 'nosniff'},
    ],
  },
],
  webpack : config => {
    // @ts-ignore
    config.plugins.push(new WindiCSSWebpackPlugin())
    config.externals.push('sharp')
    return config
  },
  pageDataCollectionTimeout : 20000,
  staticPageGenerationTimeout : 20000,
  eslint : {
    ignoreDuringBuilds : true,
  },
  images : {
    domains : [
      'www.notion.so', 'notion.so', 'images.unsplash.com',
      's3.us-west-2.amazonaws.com', 'threetrees.cloud'
    ],
    formats : [ 'image/avif', 'image/webp' ],
    dangerouslyAllowSVG : true,
    contentSecurityPolicy : "default-src 'self'; script-src 'none'; sandbox;",
  },
  reactStrictMode : true,
  rewrites :
      async () => [{source : '/social.png', destination : '/api/social-image'}],
}

if (process.env.ANALYZE === 'true')
require('@next/bundle-analyzer')({
  enabled : true,
})(nextConfig)
else module.exports = nextConfig
