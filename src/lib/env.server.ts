export const REDIS_URL = process.env.REDIS_URL
export const REDIS_EXPIRE =
  parseInt(process.env.REDIS_URL || "0") || 60 * 60 * 24 * 7 // 1 week
export const REDIS_REFRESH = parseInt(process.env.REDIS_URL || "0") || 5 * 1000 // 5 seconds
