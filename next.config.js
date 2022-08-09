/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt'
  },
  images: {
    domains: ['flagcdn.com']
  }
}

module.exports = nextConfig
