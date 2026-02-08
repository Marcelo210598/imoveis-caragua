/**
 * Rate Limiting para Next.js API Routes
 *
 * Implementação com Redis (Upstash) e fallback para in-memory.
 * Redis é preferido para produção escalável e persistência entre deploys.
 */

import { redis } from "./redis";

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

// Fallback store de rate limiting por IP (usado quando Redis não está configurado)
const rateLimitStore = new Map<string, RateLimitEntry>();

// Limpar entradas expiradas periodicamente (a cada 5 minutos)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  Array.from(rateLimitStore.entries()).forEach(([key, entry]) => {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  });
}

export type RateLimitConfig = {
  /** Número máximo de requests permitidos */
  limit: number;
  /** Janela de tempo em segundos */
  windowSeconds: number;
};

export type RateLimitResult = {
  /** Se o request deve ser permitido */
  success: boolean;
  /** Requests restantes na janela atual */
  remaining: number;
  /** Timestamp (ms) quando o limite será resetado */
  resetTime: number;
};

/**
 * Verifica se um IP atingiu o rate limit usando Redis
 */
async function checkRateLimitRedis(
  identifier: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  const key = `ratelimit:${identifier}`;
  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;

  // Incrementar contador
  const count = await redis.incr(key);

  if (count === null) {
    // Fallback para in-memory se Redis falhar
    return checkRateLimitMemory(identifier, config);
  }

  // Se é o primeiro request, definir TTL
  if (count === 1) {
    await redis.expire(key, config.windowSeconds);
  }

  // Calcular reset time baseado no TTL
  const ttl = await redis.ttl(key);
  const resetTime = now + (ttl || config.windowSeconds) * 1000;

  if (count > config.limit) {
    return {
      success: false,
      remaining: 0,
      resetTime,
    };
  }

  return {
    success: true,
    remaining: config.limit - count,
    resetTime,
  };
}

/**
 * Verifica se um IP atingiu o rate limit usando in-memory Map
 */
function checkRateLimitMemory(
  identifier: string,
  config: RateLimitConfig,
): RateLimitResult {
  cleanupExpiredEntries();

  const now = Date.now();
  const windowMs = config.windowSeconds * 1000;
  const key = identifier;

  const existing = rateLimitStore.get(key);

  // Se não existe ou expirou, criar nova entrada
  if (!existing || now > existing.resetTime) {
    const resetTime = now + windowMs;
    rateLimitStore.set(key, { count: 1, resetTime });
    return {
      success: true,
      remaining: config.limit - 1,
      resetTime,
    };
  }

  // Incrementar contador
  existing.count++;

  // Verificar se excedeu o limite
  if (existing.count > config.limit) {
    return {
      success: false,
      remaining: 0,
      resetTime: existing.resetTime,
    };
  }

  return {
    success: true,
    remaining: config.limit - existing.count,
    resetTime: existing.resetTime,
  };
}

/**
 * Verifica rate limit (Redis first, fallback to in-memory)
 */
export async function checkRateLimit(
  identifier: string,
  config: RateLimitConfig,
): Promise<RateLimitResult> {
  if (redis.isConfigured()) {
    return checkRateLimitRedis(identifier, config);
  }
  return checkRateLimitMemory(identifier, config);
}

/**
 * Versão síncrona para compatibilidade (usa apenas in-memory)
 */
export function checkRateLimitSync(
  identifier: string,
  config: RateLimitConfig,
): RateLimitResult {
  return checkRateLimitMemory(identifier, config);
}

/**
 * Extrai o IP do request
 * Considera headers de proxy (Vercel, Cloudflare, etc.)
 */
export function getClientIP(request: Request): string {
  // Vercel
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  // Cloudflare
  const cfConnectingIP = request.headers.get("cf-connecting-ip");
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback
  const xRealIP = request.headers.get("x-real-ip");
  if (xRealIP) {
    return xRealIP;
  }

  return "unknown";
}

// Configurações pré-definidas para rotas comuns
export const RATE_LIMITS = {
  // POST /api/properties - criação de imóveis
  CREATE_PROPERTY: { limit: 10, windowSeconds: 60 } as RateLimitConfig,

  // PUT/DELETE /api/property/[id] - modificação de imóveis
  MODIFY_PROPERTY: { limit: 20, windowSeconds: 60 } as RateLimitConfig,

  // POST /api/upload - upload de imagens
  UPLOAD: { limit: 30, windowSeconds: 60 } as RateLimitConfig,

  // Geral para API - mais permissivo
  GENERAL_API: { limit: 100, windowSeconds: 60 } as RateLimitConfig,
} as const;
