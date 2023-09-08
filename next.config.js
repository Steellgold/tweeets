/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    domains: ["api.producthunt.com", "pbs.twimg.com"],
  }
}

module.exports = nextConfig