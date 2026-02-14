# Sprint 17 — Monetização & Engajamento ✅

Commit `c75561b` — 11 files, +1174 linhas. Deployado no Vercel.

## Features Implementadas

| #   | Feature                                  | Arquivos                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| --- | ---------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Calculadora de Financiamento Premium** | [MortgageCalculator.tsx](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/components/MortgageCalculator.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 2   | **Google AdSense**                       | [AdBanner.tsx](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/components/AdBanner.tsx), [layout.tsx](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/app/layout.tsx), [page.tsx](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/app/imoveis/page.tsx), [id/page.tsx](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/app/imoveis/[id]/page.tsx), [ads.txt](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/public/ads.txt) |
| 3   | **Web Push Browser**                     | [PushSubscribe.tsx](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/components/PushSubscribe.tsx), [subscribe/route.ts](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/app/api/web-push/subscribe/route.ts)                                                                                                                                                                                                                                                                                                                 |
| 4   | **Share Social**                         | [ShareButtons.tsx](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/components/ShareButtons.tsx)                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 5   | **Alertas de Imóveis**                   | [PropertyAlert.tsx](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/components/PropertyAlert.tsx), [alerts/route.ts](file:///Users/marcelodifoggiajunior/Desktop/Projetos%20AI/litoral-norte-imoveis/app/api/alerts/route.ts)                                                                                                                                                                                                                                                                                                                                |

## Screenshots do Site Live

```carousel
![Listagem — botão "Ativar notificações" no header](/Users/marcelodifoggiajunior/.gemini/antigravity/brain/76ed5513-aa4b-4f97-b171-b7cbe2b30d67/listing_page_header_with_notif_1771030475806.png)
<!-- slide -->
![Detalhe — botão "Compartilhar" + Calculadora premium na sidebar](/Users/marcelodifoggiajunior/.gemini/antigravity/brain/76ed5513-aa4b-4f97-b171-b7cbe2b30d67/property_detail_share_calc_top_1771030382473.png)
<!-- slide -->
![Calculadora — modo SAC com toggle funcionando](/Users/marcelodifoggiajunior/.gemini/antigravity/brain/76ed5513-aa4b-4f97-b171-b7cbe2b30d67/mortgage_calculator_sac_mode_1771030424367.png)
```

## Calculadora de Financiamento — Destaques

- **Toggle SAC vs Price** — duas modalidades de cálculo
- **Gradient card** — resultado da parcela com design premium
- **Barra Capital vs Juros** — visualização proporcional
- **Cards de resumo** — Entrada, Financiado, Total Pago
- **Dica contextual** — explica a diferença entre SAC e Price
- **Sliders coloridos** — verde (entrada), azul (juros), violeta (prazo)

## Schema — Novas Tabelas

- `web_push_subscriptions` — armazena browser push subscriptions
- `property_alerts` — alertas de imóveis por critérios (cidade, tipo, preço, área)

## ✅ Google AdSense Implantado

A estrutura completa está pronta. Coloquei banners em locais estratégicos:

- **Listagem**: Um banner horizontal acima do grid de imóveis.
- **Detalhe do Imóvel**: Um banner horizontal acima da descrição e outro retangular na sidebar abaixo do botão de contato.

### O que você precisa fazer:

1. **Ativar o ID**: No Vercel (ou seu `.env` local), adicione a variável:
   `NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXXXX` (seu ID de editor).
2. **Slots**: Usei slots genéricos nos componentes. Se quiser IDs de blocos específicos criados no Google, pode editá-los em `app/imoveis/page.tsx` e `app/imoveis/[id]/page.tsx`.

## Para Ativar AdSense (Resumo)

Quando o Google aprovar o site, basta adicionar no `.env`:

```
NEXT_PUBLIC_ADSENSE_ID=ca-pub-9423533053344449
```

### ✅ Arquivo `ads.txt` configurado

Publiquei o arquivo com seu ID correto (`pub-9423533053344449`).

- **Link live**: [https://imoveis-caragua.vercel.app/ads.txt](https://imoveis-caragua.vercel.app/ads.txt)
- Isso vai remover o erro "Não encontrado" do seu painel AdSense em instantes.

> [!TIP]
> **Se a verificação por código falhar:**
> No popup do AdSense, selecione a opção **"Snippet do ads.txt"** e clique em Verificar. Como o arquivo já está publicado, essa validação costuma ser imediata.

![Gravação da verificação do Sprint 17](/Users/marcelodifoggiajunior/.gemini/antigravity/brain/76ed5513-aa4b-4f97-b171-b7cbe2b30d67/sprint17_verification_1771029453930.webp)
