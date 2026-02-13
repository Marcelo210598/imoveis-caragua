# Checklist de Publicação Google Play Store

## 1. Configurações do App (`app.json`)

- [x] **Package Name**: `com.litoralnorte.app`
- [x] **Version Code**: 3 (incremental para cada update)
- [x] **Adaptive Icon**: Ícone de fundo e frente separados (Android 12+)
- [x] **Permissions**: NOTIFICATIONS, INTERNET, ACCESS_NETWORK_STATE (apenas o necessário para WebView + Push)
- [x] **App Name**: "Litoral Norte Imóveis"
- [x] **Splash Screen**: Fundo dark navy (#0f172a)
- [x] **Notifications Plugin**: expo-notifications configurado

## 2. Conteúdo da Loja (Play Console)

- [x] **Nome do App**: "Litoral Norte Imóveis" (21 caracteres ✓)
- [x] **Descrição Curta**: "Encontre casas, apartamentos e terrenos no Litoral Norte de São Paulo." (71 chars ✓)
- [x] **Descrição Completa**: Detalhes sobre o app com emojis e formatação Play Store
- [x] **Ícone do App**: 512x512 px gerado em `mobile/assets/icon-512.png`
- [x] **Feature Graphic**: 1024x500 px gerado em `mobile/assets/feature-graphic.png`

> Todos os textos estão no arquivo `mobile/store-listing.md` prontos para copiar e colar no Play Console.

## 3. Screenshots (Capturas de Tela)

_Mínimo de 2 screenshots por tipo de dispositivo suportado._

- [ ] **Celular**: Proporção 9:16 (ex: 1080x1920) — Tirar prints do site no celular
- [ ] **Tablet 7"**: (Opcional, mas recomendado)
- [ ] **Tablet 10"**: (Opcional, mas recomendado)

> 💡 Dica: Abra o site em https://imoveis-caragua.vercel.app no Chrome, use F12 > Dimensões de celular, e tire screenshots das telas principais (Home, Busca, Detalhe do Imóvel).

## 4. Política de Privacidade

- [x] Página `/politica-de-privacidade` já existe no site.
- [ ] Inserir link no Play Console: `https://imoveis-caragua.vercel.app/politica-de-privacidade`

## 5. Testes

- [ ] Teste Interno: Versão para sua conta e equipe.
- [ ] Teste Fechado: Pequeno grupo de usuários convidados.
- [ ] Produção: Lançamento para o público geral.

## 6. Build Final

- [ ] Gerar novo `.aab` com as configs atualizadas: `eas build -p android --profile production`
- [ ] Upload do `.aab` no Google Play Console

## 7. Arquivos de Referência

- `mobile/app.json` — Configuração do app (atualizado)
- `mobile/store-listing.md` — Textos prontos para o Play Console
- `mobile/assets/icon-512.png` — Ícone para Play Store
- `mobile/assets/feature-graphic.png` — Imagem de destaque
- `app/politica-de-privacidade/page.tsx` — Página de privacidade
