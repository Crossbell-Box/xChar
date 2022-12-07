import getConfig from "next/config"

const { ENV_REDIS_URL, ENV_REDIS_EXPIRE, ENV_REDIS_REFRESH } = getConfig()

export const REDIS_URL = ENV_REDIS_URL || process.env.REDIS_URL
export const REDIS_EXPIRE =
  parseInt(ENV_REDIS_EXPIRE || process.env.REDIS_URL || "0") || 60 * 60 * 24 * 7 // 1 week
export const REDIS_REFRESH =
  parseInt(ENV_REDIS_REFRESH || process.env.REDIS_URL || "0") || 5 * 1000 // 5 seconds
