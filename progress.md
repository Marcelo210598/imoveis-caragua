# Litoral Norte Imoveis - Progresso

## Ultima atualizacao: 2026-02-04

## Visao Geral
- **Objetivo**: Marketplace de imoveis do Litoral Norte de SP (proprietarios anunciam, usuarios favoritam e contactam)
- **Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS, Prisma 7, Neon PostgreSQL, NextAuth v5, Twilio, Vercel Blob
- **Status**: v1.0 - Marketplace funcional com 5 sprints implementados

## Concluido

### Sprint 1 - Banco de Dados
- [x] Prisma 7 com Neon PostgreSQL (adapter-pg)
- [x] Schema: User, Property, PropertyPhoto, Favorite, Message, VerificationCode
- [x] Seed de 110 imoveis do JSON para o banco
- [x] lib/properties.ts reescrito com queries Prisma async
- [x] Todas as paginas adaptadas para dados do banco

### Sprint 2 - Autenticacao
- [x] NextAuth v5 com CredentialsProvider (phone-otp)
- [x] Twilio Verify para envio/validacao de OTP por SMS
- [x] LoginModal com input de telefone e 6 digitos OTP
- [x] UserMenu no Header (avatar, links, logout)
- [x] AuthProvider e SessionProvider no layout

### Sprint 3 - Favoritos
- [x] API POST/DELETE /api/property/[id]/favorite
- [x] API GET /api/user/favorites e /api/user/favorites/ids
- [x] FavoritesProvider com estado global e atualizacao otimista
- [x] Coracao animado no PropertyCard
- [x] Pagina /favoritos com grid dos imoveis salvos
- [x] Login modal quando nao autenticado tenta favoritar

### Sprint 4 - Upload e Criacao de Imoveis
- [x] Upload de fotos via Vercel Blob (/api/upload)
- [x] ImageUploader com drag-and-drop, preview, reordenacao
- [x] Formulario multi-step (tipo, detalhes, fotos, revisao)
- [x] Validacao com Zod 4 no backend
- [x] Limite de 5 imoveis ativos por usuario
- [x] Filtro venda/aluguel no FilterSidebar e API
- [x] Botao "Anunciar" no Header

### Sprint 5 - Dashboard e Contato
- [x] Dashboard /meus-imoveis (listar, ativar/desativar, remover)
- [x] API PUT/DELETE para gerenciar imoveis do proprietario
- [x] ContactButton: WhatsApp para imoveis de usuarios, link pro portal para scraped
- [x] OwnerInfo card na pagina de detalhe
- [x] Pagina de perfil /perfil
- [x] Secao de descricao na pagina de detalhe

### Extras
- [x] Dark mode com ThemeProvider e toggle (respeita preferencia do sistema)
- [x] Responsividade mobile melhorada (homepage, city cards, hero, stats)
- [x] Logo SVG e favicon personalizados
- [x] Script inline no head para evitar flash de tema

## Em progresso
- Nenhum item em progresso

## Proximos passos (Sprint 6 - Polish & Deploy)
- [ ] Configurar env vars de producao no Vercel (TWILIO, NEXTAUTH)
- [ ] SEO metadata dinamica por pagina de imovel
- [ ] Rate limit de 3 OTP/hora por telefone (ja implementado parcialmente)
- [ ] Testar fluxo completo em producao
- [ ] Melhorar fallback de imagens quebradas
- [ ] Notificacao in-app quando favoritam seu imovel (badge no Header)
- [ ] Open Graph images dinamicas
- [ ] ISR para paginas de imoveis

## Variaveis de Ambiente
```
DATABASE_URL=postgresql://... (Neon)
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3002 (local) / https://imoveis-caragua.vercel.app (prod)
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SERVICE_SID=...
BLOB_READ_WRITE_TOKEN=... (Vercel Blob - configurado via Storage)
```

## Dependencias principais
- next 14.2, react 18.2, typescript 5
- prisma 7.3, @prisma/client, @prisma/adapter-pg, pg
- next-auth 5.0.0-beta.30
- twilio 5.12
- @vercel/blob, zod 4.3
- lucide-react, recharts, clsx, tailwindcss 3.4
