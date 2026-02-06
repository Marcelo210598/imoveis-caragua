# Sistema de Scraping Automatizado - Guia de Uso

O sistema de scraping foi implementado para coletar automaticamente imóveis do **ZapImóveis**, **VivaReal** e **OLX**.

## 🚀 Como Usar

### 1. Painel Admin (Manual)

Acesse a página: **`/admin/scraper`**

Nesta página você pode:

- **Iniciar Scraping**: Botão para disparar a coleta manual de todas as fontes.
- **Ver Logs**: Acompanhe o progresso em tempo real no terminal da página.
- **Status**: Veja se houve erros ou sucesso na execução.

### 2. Execução Automática (Cron)

O sistema está configurado para rodar **todos os dias às 02:00 AM** (BRT).

- **Arquivo**: `vercel.json` define o agendamento.
- **Rota**: `/api/scraper/cron` é chamada automaticamente.

### 3. Fontes e Filtros

O sistema busca automaticamente por:

- **Cidades**: Caraguatatuba, Ubatuba, São Sebastião, Ilhabela
- **Fontes**: ZapImóveis, VivaReal, OLX
- **Tipos**: Todos (Venda e Aluguel)

## 🛠️ Detalhes Técnicos

### Arquivos Principais

- `lib/scrapers/`: Lógica de extração de cada portal.
- `app/api/scraper/route.ts`: API Endpoint.
- `app/admin/scraper/page.tsx`: Interface visual.

### Prevenção de Bloqueios

- **Rate Limiting**: Pausas de 2-3 segundos entre requisições.
- **Headers**: Simulação de navegador real (User-Agent).
- **Tratamento de Erros**: Se um portal bloquear, os outros continuam funcionando.

## ⚠️ Troubleshooting

**Erro "Prisma Client not initialized"**:

- Execute: `npx prisma generate`

**Erro de Dependências**:

- Execute: `npm install` (certifique-se que cheerio e axios estão instalados)

**Bloqueio (403 Forbidden)**:

- Se aparecer "BLOQUEIO ZAP" nos logs, o IP pode ter sido temporariamente banido pelo portal. Aguarde algumas horas.
