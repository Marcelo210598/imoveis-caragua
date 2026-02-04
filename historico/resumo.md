# Litoral Norte Imoveis - Resumo Geral

## Sobre o Projeto
Marketplace de imoveis do Litoral Norte de SP.
Proprietarios anunciam imoveis, usuarios favoritam e contactam diretamente.
Imoveis scraped (ZAP/VivaReal) coexistem com imoveis criados por usuarios.

## Stack
- Next.js 14 (App Router) | React 18 | TypeScript
- Tailwind CSS | lucide-react | recharts
- Prisma 7 + Neon PostgreSQL (adapter-pg)
- NextAuth v5 (beta.30) com phone OTP via Twilio Verify
- Vercel Blob para upload de imagens
- Zod 4 para validacao
- Deploy: Vercel

## URLs
- Producao: https://imoveis-caragua.vercel.app/
- Repo: https://github.com/Marcelo210598/imoveis-caragua

## Estrutura
```
litoral-norte-imoveis/
├── app/
│   ├── layout.tsx, page.tsx (homepage)
│   ├── imoveis/page.tsx, [id]/page.tsx, novo/page.tsx
│   ├── deals/page.tsx
│   ├── favoritos/page.tsx
│   ├── meus-imoveis/page.tsx
│   ├── perfil/page.tsx
│   ├── icon.svg (favicon)
│   └── api/
│       ├── auth/[...nextauth]/, send-otp/, verify-otp/
│       ├── properties/ (GET + POST)
│       ├── property/[id]/ (GET + PUT + DELETE)
│       ├── property/[id]/favorite/ (POST + DELETE)
│       ├── upload/ (POST)
│       └── user/favorites/, favorites/ids/, properties/, profile/
├── components/
│   ├── Header.tsx, Footer.tsx, SearchBar.tsx, FilterSidebar.tsx
│   ├── PropertyCard.tsx, ThemeProvider.tsx, ThemeToggle.tsx
│   ├── auth/ (AuthProvider, LoginModal, UserMenu)
│   ├── contact/ (ContactButton, OwnerInfo)
│   ├── favorites/ (FavoriteButton, FavoritesProvider)
│   └── property/ (ImageUploader, PropertyForm)
├── lib/ (prisma.ts, properties.ts, auth.ts, twilio.ts, validations.ts, utils.ts)
├── prisma/ (schema.prisma, seed.ts)
├── public/ (logo.svg)
├── types/property.ts
├── data/properties.json (110 imoveis seed)
└── historico/
```

## Status: v1.0 - Marketplace funcional (5 sprints completos)

### Features implementadas
- Homepage com hero, cards por cidade, top deals, stats
- Listagem com filtros (cidade, preco, quartos, tipo venda/aluguel, deals)
- Detalhe com galeria, chart de preco vs media, descricao, info do dono
- Auth por telefone com OTP (Twilio Verify)
- Favoritos com coracao animado e pagina dedicada
- Upload de fotos via Vercel Blob (drag-and-drop, reordenacao)
- Criacao de imoveis (formulario multi-step, limite 5 por usuario)
- Dashboard do proprietario (listar, ativar/desativar, remover)
- Contato direto via WhatsApp (imoveis de usuarios)
- Dark mode com toggle e persistencia (localStorage + system preference)
- Responsividade mobile
- Logo SVG e favicon personalizados

### Env vars necessarias
```
DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_VERIFY_SERVICE_SID
BLOB_READ_WRITE_TOKEN
```

## Historico de sessoes
- **2026-02-03**: Setup inicial, homepage, listagem, detalhe, fix flickering
- **2026-02-04**: Sprints 3-5 (favoritos, upload/criacao, dashboard/contato), dark mode, responsividade, logo/favicon

## Pendencias (Sprint 6 - Polish & Deploy)
1. Configurar env vars de producao no Vercel
2. SEO metadata dinamica por pagina de imovel
3. Rate limit de 3 OTP/hora por telefone
4. Testar fluxo completo em producao
5. Melhorar fallback de imagens quebradas
6. Notificacao in-app quando favoritam seu imovel
7. Open Graph images dinamicas
8. ISR para paginas de imoveis
