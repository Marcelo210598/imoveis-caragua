# 🌟 Sistema de Destaques Manual - Guia de Uso

## O que é?

Sistema que permite ao admin destacar imóveis sem necessidade de pagamento, além de permitir que o sistema automático de pagamento (Mercado Pago) também ative destaques.

## Como funciona?

### 1️⃣ Acessar o Painel de Destaques

- Vá para `/admin/properties`
- Você verá uma tabela com todos os imóveis
- Coluna "Destaque" mostra o status atual

### 2️⃣ Ativar Destaque Manualmente

1. Clique no botão **"Sem Destaque"** (cinza) ou **"Destaque Ativo"** (amarelo)
2. Um modal abrirá com opções:
   - **7 dias**
   - **15 dias**
   - **30 dias**
   - **Indefinido** (sem expiração)
3. Escolha a duração e clique
4. Pronto! Destaque ativado 🎉

### 3️⃣ Remover Destaque

Se um imóvel já está em destaque:
1. Clique em **"Destaque Ativo"** (botão amarelo)
2. Modal mostra quando expira
3. Clique em **"Remover Destaque"**
4. Confirmado ✅

### 4️⃣ Ver Expiração

Quando ativo, o botão mostra:
- **Destaque Ativo** em amarelo
- Data/hora de expiração no tooltip ao passar o mouse

## 📊 Estatísticas

O sistema usa os campos do banco já existentes:
- `isFeatured`: Boolean (true/false)
- `featuredExpiresAt`: DateTime (quando expira)

## 🤝 Compatibilidade com Pagamento

✅ **Funciona junto com Mercado Pago**
- Usuários podem PAGAR por destaque via `/imoveis/[id]`
- Admin pode GRATUITAMENTE destacar qualquer imóvel
- Pagamentos e destaques manuais não conflitam

## 🔒 Segurança

- Apenas **admins** podem usar essa funcionalidade
- Verificação de role no backend em cada request
- Se não-admin tentar acessar, é redirecionado para home

## 🛠️ Desenvolvimento

### Arquivos Modificados

```
API:
- app/api/admin/properties/[id]/feature/route.ts

Componentes:
- components/admin/AdminFeatureToggle.tsx

Páginas:
- app/admin/properties/page.tsx
- app/admin/layout.tsx

Serviços:
- app/api/admin/properties/route.ts (retorna featuredExpiresAt)
```

### Endpoints

#### POST `/api/admin/properties/[id]/feature`

**Autenticação**: Requer admin

**Body**:
```json
{
  "action": "activate" | "deactivate",
  "duration": 7 | 15 | 30 | 999 (opcional, default: 30)
}
```

**Response**:
```json
{
  "success": true,
  "message": "Destaque ativado por X dias",
  "property": {
    "id": "...",
    "isFeatured": true,
    "featuredExpiresAt": "2026-03-20T..."
  }
}
```

## 🚀 Próximas Melhorias

- [ ] Cron job para expiração automática
- [ ] Dashboard com métricas de destaques
- [ ] Filtro "Apenas Destacados" na listagem
- [ ] Histórico de mudanças de destaque
- [ ] Notificação quando destaque vai expirar

## ❓ FAQ

**P: Posso destacar um imóvel infinitamente?**
R: Sim! Escolha a opção "Indefinido" e ele nunca expirará.

**P: Se o usuário pagar por destaque, o admin pode remover?**
R: Sim, admin tem controle total independente do pagamento.

**P: O destaque afeta a ordem de exibição?**
R: Sim, destaques aparecem no topo das buscas (orderBy isFeatured DESC).

**P: Quanto custa usar destaques manuais?**
R: Absolutamente grátis! Apenas admin usa, sem pagamento envolvido.

---

Desenvolvido com ❤️ em 17/02/2026
