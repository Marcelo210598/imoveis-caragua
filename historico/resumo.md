# Litoral Norte Imoveis - Resumo Geral

## Sobre o Projeto
Frontend para exibir imoveis do Litoral Norte de SP.
Consome dados do scraper (JSON estatico).

## Stack
- Next.js 14 (App Router) | React 18 | TypeScript
- Tailwind CSS | lucide-react | recharts
- Deploy: Vercel

## URLs
- Producao: https://imoveis-caragua.vercel.app/
- Repo: https://github.com/Marcelo210598/imoveis-caragua

## Estrutura
```
litoral-norte-imoveis/
├── app/
│   ├── layout.tsx, page.tsx (homepage)
│   ├── imoveis/page.tsx, [id]/page.tsx
│   ├── deals/page.tsx
│   └── api/properties/, api/property/[id]/
├── components/ (8 componentes)
├── lib/properties.ts, utils.ts
├── types/property.ts
├── data/properties.json (110 imoveis)
└── historico/
```

## Status: v0.2 (deployado e funcionando)
- Homepage com hero, cards por cidade, top deals, stats
- Listagem com filtros (cidade, preco, quartos, deals) - sem flickering
- Detalhe com galeria, chart de preco vs media
- 110 imoveis, 4 cidades, 6 oportunidades
- Build passando, deploy funcionando no Vercel

## Historico de fixes
- **2026-02-03**: Fix flickering na listagem (loop de re-renders no SearchBar, debounce nos inputs de preco, AbortController nos fetches)

## Pendencias
1. Melhorar fallback de imagens quebradas
2. Conectar ao banco Neon (em vez de JSON estatico)
3. Mais imoveis via scraper com scroll infinito
4. SEO por pagina, ISR se dados mudarem frequentemente
