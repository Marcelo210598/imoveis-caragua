/**
 * Rate Limiting para Next.js API Routes
 *
 * Implementação in-memory usando Map.
 * Nota: será resetado a cada deploy. Para produção escalável, usar Redis.
 */

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

// Store de rate limiting por IP
const rateLimitStore = new Map<string, RateLimitEntry>();

// Limpar entradas expiradas periodicamente (a cada 5 minutos)
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  // Convert to array to avoid iterator compatibility issues
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
 * Verifica se um IP atingiu o rate limit
 *
 * @param identifier - IP ou outro identificador único
 * @param config - Configuração do rate limit
 * @returns Resultado com status e informações do limite
 */
export function checkRateLimit(
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
