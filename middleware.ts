import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Content Security Policy - permite recursos necessários mantendo segurança
const CSP_DIRECTIVES = [
  "default-src 'self'",
  // Scripts: self + Vercel Analytics + inline necessário para Next.js
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  // Estilos: self + inline para Tailwind
  "style-src 'self' 'unsafe-inline'",
  // Imagens: self + data URIs + blob + HTTPS externos (ZAP, Viva, Vercel Blob)
  "img-src 'self' data: blob: https:",
  // Fonts: self + data URIs (para fontes inline)
  "font-src 'self' data:",
  // Conexões: self + APIs externas necessárias
  "connect-src 'self' https://api.twilio.com https://vitals.vercel-insights.com https://*.vercel-insights.com https://*.vercel-storage.com https://vercel.com https://*.vercel.app",
  // Frames: bloquear embedding
  "frame-ancestors 'none'",
  // Form actions: apenas para o próprio site
  "form-action 'self'",
  // Base URI: apenas self
  "base-uri 'self'",
].join("; ");

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Content Security Policy
  response.headers.set("Content-Security-Policy", CSP_DIRECTIVES);

  // Prevenir MIME type sniffing
  response.headers.set("X-Content-Type-Options", "nosniff");

  // Prevenir clickjacking
  response.headers.set("X-Frame-Options", "DENY");

  // XSS Protection (legacy, mas ainda útil para browsers antigos)
  response.headers.set("X-XSS-Protection", "1; mode=block");

  // Controlar informações de referrer
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  // HSTS - forçar HTTPS (1 ano)
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains",
  );

  // Permissions Policy - desabilitar APIs sensíveis não utilizadas
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );

  return response;
}

// Aplicar apenas para páginas e API routes, não para arquivos estáticos
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
