# Plano de Implementação: Notificações Push

## Objetivo

Implementar notificações push no App Android (Expo) que exibe o site Next.js via WebView.

## Estratégia

Usar uma abordagem híbrida onde o App Nativo gerencia o token e o Site gerencia o envio.

### 1. App Mobile (Expo)

- [x] Instalar `expo-notifications`, `expo-device`, `expo-constants`.
- [x] No `App.js`:
  - Pedir permissão de notificações ao abrir.
  - Gerar `ExpoPushToken`.
  - Injetar esse token no WebView via `window.ReactNativeWebView.postMessage`.

### 2. Frontend (Next.js)

- [x] Criar componente `MobileSync` (Client Component).
  - Ouvir eventos `message` do WebView.
  - Ao receber token, chamar API para salvar.
- [x] Inserir `MobileSync` no `layout.tsx` principal.

### 3. Backend (API Routes)

- [x] Criar Model `MobileDevice` no Prisma:
  ```prisma
  model MobileDevice {
    id        String   @id @default(cuid())
    token     String   @unique
    platform  String   // "android" | "ios"
    userId    String?  // Opcional, para vincular a usuario logado
    createdAt DateTime @default(now())
    user      User?    @relation(fields: [userId], references: [id])
  }
  ```
- [x] Criar Rota `POST /api/user/push-token`:
  - Recebe `{ token, platform }`.
  - Salva ou atualiza no DB.

### 4. Envio de Notificações

- [x] Criar lib utilitária `lib/expo-push.ts` usando `expo-server-sdk`.
- [ ] (Futuro) Criar trigger para enviar notificação quando houver nova mensagem ou lead.

## Arquivos Criados/Modificados

- `mobile/App.js`
- `prisma/schema.prisma`
- `components/pwa/MobileSync.tsx`
- `app/layout.tsx`
- `app/api/user/push-token/route.ts`
