# Litoral Norte Imóveis - Progresso

## Ultima atualizacao: 2026-02-13

**Status**: v1.9 - Sprint 17 (AdSense, Push & Calculator)

---

## 🚀 Próximos Passos (Backlog)

- [ ] Screenshots do app para Play Store (mín. 2 celular)
- [ ] Upload do `.aab` no Google Play Console
- [ ] Teste Interno → Fechado → Produção
- [ ] Edição de fotos dos imóveis
- [ ] Admin Panel avançado
- [ ] Sistema de Monetização (Destaques, Planos Premium)
- [ ] Integração com Gateway de Pagamento (Futuro)

---

## ✅ Concluído

### Sprint 17: Monetização & Engajamento (13/02/2026)

- [x] **AdSense**: Script global, `ads.txt` verificado, componentes de banner
- [x] **Calculadora**: Redesign premium (SAC/Price), gráficos interativos
- [x] **Web Push**: Notificações no navegador (Service Worker)
- [x] **Alertas**: Lead generation com filtros de busca (backend + UI)
- [x] **Social**: Compartilhamento nativo e botões de redes sociais

### Sprint 14: Play Store Preparation (13/02/2026)

- [x] **App Config**: Nome, permissões, dark splash, expo-notifications plugin
- [x] **Store Assets**: Ícone 512px e Feature Graphic gerados
- [x] **Store Listing**: Textos completos (nome, descrição curta/completa, tags)
- [x] **Checklist**: Atualizado com todas as pendências e referências
- [x] **Política de Privacidade**: Página já existente confirmada

### Sprint 13: Blog & SEO (09/02/2026)

- [x] **Sistema de Blog**: Backend (Prisma), Admin Panel (CRUD) e Frontend Público
- [x] **SEO Content**: Seed inicial com 5 artigos estratégicos
- [x] **SEO Técnico**: Sitemap automatizado, Metadados dinâmicos e Open Graph
- [x] **Componentes UI**: Nova biblioteca de componentes leves (sem radix-ui)

### Infraestrutura & Fixes (09/02/2026) -> Sprint 13.5

- [x] **Vercel Blob Client-Side**: Upload sem limite de tamanho (bypass server limit)
- [x] **Security**: Ajuste de CSP para permitir uploads externos
- [x] **Deploy Pipeline**: Correção de vínculo de projeto Vercel/Git
- [x] **Admin UI**: Correção de contraste (Dark Mode) e Permissões

### Sprint 12: SEO Mastery (08/02/2026)

- [x] **Sitemap & Robots**: Geração automática de URLs para indexação
- [x] **Rich Snippets**: JSON-LD para Imóveis (Preço, Endereço, Avaliações)
- [x] **Local Business**: Schema.org para a imobiliária (Telefone, Endereço, Geo)
- [x] **Mobile App**: Setup Expo Android, WebView, Notificações Push
- [x] **Store Readiness**: Política de Privacidade e Build (.aab) para Play Store

### Sprint 11: Painel do Proprietário & UX (v1.7)

- [x] Dashboard (`/dashboard`) para gestão de imóveis
- [x] Edição e Exclusão de imóveis pelo usuário
- [x] UI Polish: Toasts, Skeletons, Error Pages
- [x] WhatsApp Button com Analytics
- [x] **New**: Perfil do Usuário V2 (Mobile-First, Edição)
- [x] **New**: PWA Install Prompt
- [x] **New**: Página de Contato e Redirects

### Sprint 10 - Features Gratuitas (08/02/2026)

- **Sistema de Avaliações**: Reviews com estrelas e comentários
- **Push Notifications**: Integração PWA com Service Worker
- **Redis Rate Limiting**: Upstash Redis para proteção de API
- **Integração Reviews**: Componente na página de detalhes

### Sprint 9 - Mega Sprint (08/02/2026)

- **PWA**: Manifest, ícones 192/512, meta tags Apple
- **Admin Dashboard**: `/admin/dashboard` com métricas e gráficos
- **E2E Tests**: Playwright config, testes homepage e properties (6/7 ✓)
- **Sistema de Mensagens**: API + UI de chat em `/mensagens`
- **SEO/GEO**: Meta tags, JSON-LD Schema.org, H1 semântico, texto descritivo

### Sprint 8 - Segurança OWASP (08/02/2026)

- **Security Headers via Middleware**:
  - CSP, HSTS, X-Frame-Options, X-Content-Type-Options
  - Permissions-Policy, Referrer-Policy
- **Rate Limiting**:
  - 10 req/min criação, 20 req/min modificação, 30 req/min upload
- **Input Sanitization**:
  - XSS prevention em campos de texto
  - UUID validation schema

### Sprint 7 - Filtros Avançados + Analytics (06/02/2026)

- **Filtros Avançados**:
  - Tipo de Imóvel (Casa, Apt, Terreno, Comercial)
  - Área (m²) com inputs min/max e debounce
  - Backend API atualizada para suportar novos filtros
- **Analytics**:
  - Setup do Vercel Analytics e Speed Insights no layout
  - Monitoramento de visitas e Web Vitals

### Sprint 6 - Polish & Deploy (05/02/2026)

- SEO metadata dinâmico (`generateMetadata`)
- Open Graph images dinâmicas
- Rate limit de 3 OTP/hora
- ISR para páginas de imóveis (1h)
- Fallback de imagens quebradas
- Notificação in-app (Sino + API)

### Sprint 5.5 - Scraping Automatizado (05/02/2026)

- Sistema multi-fonte: ZapImóveis, VivaReal, OLX
- Rate limiting e normalização de dados
- Cron job diário (02:00 AM) via `vercel.json`
- Admin panel `/admin/scraper` para controle manual
- API `/api/scraper` e `/api/scraper/cron`

### Sprint 5 - Dashboard e Contato

- Dashboard `/meus-imoveis`
- Owner Info e Contact Button (WhatsApp/Link)
- Dark mode completo com persistência

### Sprint 4 - Upload e Criação

- Upload via Vercel Blob
- Formulário multi-step com validação Zod
- Limite de 5 imóveis por usuário

### Sprint 3 - Favoritos

- Sistema de favoritos (Heart button)
- Página `/favoritos`
- Otimistic UI updates

### Sprint 1 & 2 - Core & Auth

- Prisma + Neon PostgreSQL
- NextAuth v5 (Phone OTP via Twilio)
- Schema DB: User, Property, Neighbor, etc.

---

## 📚 Histórico Detalhado

### 05/02/2026 - Relatório de Melhorias (Scraping & Fixes)

- **Dark Mode Fix**: Contraste corrigido em todo o formulário de propriedade.
- **Hard Delete**: Implementada remoção permanente de imóveis (antes era soft delete).
- **Git Push**: Resolvidos problemas de travamento do git no terminal.
- **Scraping**: Implementação completa dos scrapers de ZAP, VivaReal e OLX.

### 04/02/2026 - Sprints 3, 4 e 5

- Foco em funcionalidades de usuário: Favoritos, Upload, Criação de Imóveis.
- Implementação do Dashboard do Proprietário.
- Criação da identidade visual (Logo, Favicon).

### 03/02/2026 - Setup Inicial

- Configuração do Next.js 14, Tailwind, Prisma.
- Criação dos componentes base (Header, Footer, PropertyCard).
- Setup do Vercel e deploy inicial.

---

## 🛠️ Stack & Vars

### Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Lucide Icons
- **Backend**: Next.js API Routes, Prisma ORM
- **DB**: Neon PostgreSQL
- **Auth**: NextAuth v5 + Twilio Verify
- **Storage**: Vercel Blob
- **Analytics**: Vercel Analytics + Speed Insights

### Env Vars (Produção)

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://imoveis-caragua.vercel.app
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
TWILIO_VERIFY_SERVICE_SID=...
BLOB_READ_WRITE_TOKEN=...
```

---

## 📂 Estrutura de Pastas Importantes

- `app/api/scraper`: Lógica dos scrapers e cron job
- `lib/scrapers`: Classes de scraping (Zap, OLX, VivaReal)
- `components/FilterSidebar`: Lógica de filtros (Preço, Área, Tipo)
- `prisma/schema.prisma`: Definição do banco de dados
