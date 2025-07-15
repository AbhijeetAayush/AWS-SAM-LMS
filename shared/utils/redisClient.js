const { Redis } = require("@upstash/redis");
const { redisUrl } = require("../config");

const redis = new Redis({ url: redisUrl });

async function rateLimit(key, limit, windowSeconds) {
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;
  const pipeline = redis.pipeline();
  pipeline.zremrangebyscore(key, 0, windowStart);
  pipeline.zcard(key);
  pipeline.zadd(key, { score: now, member: `${now}:${Math.random()}` });
  pipeline.expire(key, windowSeconds);
  const results = await pipeline.exec();
  const count = results[1];
  return count <= limit;
}

module.exports = { redis, rateLimit };
