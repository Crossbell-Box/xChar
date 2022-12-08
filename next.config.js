const execSync = require("child_process").execSync
const lastCommitCommand = "git rev-parse HEAD"

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy:
      "default-src 'self'; script-src 'none'; sandbox; style-src 'unsafe-inline';",
    remotePatterns: [{ hostname: "**" }],
  },

  serverRuntimeConfig: {
    ENV_REDIS_URL: process.env.REDIS_URL,
    ENV_REDIS_EXPIRE: process.env.REDIS_EXPIRE,
    ENV_REDIS_REFRESH: process.env.REDIS_REFRESH,
  },

  async generateBuildId() {
    return execSync(lastCommitCommand).toString().trim()
  },
}

module.exports = nextConfig
