/**
 * Redis Client - Upstash REST API
 * Tier gratuito: 10K comandos/dia
 *
 * Setup:
 * 1. Criar conta em https://upstash.com
 * 2. Criar database Redis
 * 3. Copiar UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN
 * 4. Adicionar no Vercel Environment Variables
 */

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

type RedisCommand = "GET" | "SET" | "INCR" | "EXPIRE" | "TTL" | "DEL" | "SETEX";

async function redisCommand<T>(
  command: RedisCommand,
  ...args: (string | number)[]
): Promise<T | null> {
  if (!REDIS_URL || !REDIS_TOKEN) {
    console.warn("Redis not configured, using fallback");
    return null;
  }

  try {
    const response = await fetch(`${REDIS_URL}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${REDIS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([command, ...args]),
    });

    if (!response.ok) {
      console.error("Redis error:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.result as T;
  } catch (error) {
    console.error("Redis connection error:", error);
    return null;
  }
}

export const redis = {
  /**
   * Get value by key
   */
  get: async (key: string): Promise<string | null> => {
    return redisCommand<string>("GET", key);
  },

  /**
   * Set key-value pair
   */
  set: async (key: string, value: string | number): Promise<boolean> => {
    const result = await redisCommand<string>("SET", key, String(value));
    return result === "OK";
  },

  /**
   * Set with expiration (in seconds)
   */
  setex: async (
    key: string,
    seconds: number,
    value: string | number,
  ): Promise<boolean> => {
    const result = await redisCommand<string>(
      "SETEX",
      key,
      seconds,
      String(value),
    );
    return result === "OK";
  },

  /**
   * Increment counter
   */
  incr: async (key: string): Promise<number | null> => {
    return redisCommand<number>("INCR", key);
  },

  /**
   * Set TTL on key
   */
  expire: async (key: string, seconds: number): Promise<boolean> => {
    const result = await redisCommand<number>("EXPIRE", key, seconds);
    return result === 1;
  },

  /**
   * Get TTL of key
   */
  ttl: async (key: string): Promise<number | null> => {
    return redisCommand<number>("TTL", key);
  },

  /**
   * Delete key
   */
  del: async (key: string): Promise<boolean> => {
    const result = await redisCommand<number>("DEL", key);
    return result === 1;
  },

  /**
   * Check if Redis is configured
   */
  isConfigured: (): boolean => {
    return !!(REDIS_URL && REDIS_TOKEN);
  },
};
