# Mobile App & Push Notifications - Walkthrough

## O que foi feito

1.  **Criação do App Android**:
    - Iniciado projeto Expo em `mobile/`.
    - Configurado `WebView` para carregar o site em tela cheia.
    - Gerado build `.aab` (Android App Bundle) otimizado para produção.

2.  **Notificações Push**:
    - Implementado sistema híbrido: App Nativo (Expo) <-> Site (Next.js).
    - O App gera um token único do dispositivo e envia para o site.
    - O site salva esse token no banco de dados Neon (nova tabela `MobileDevice`).
    - Criada estrutura para envio de notificações via API.

3.  **Preparação para Loja (Google Play)**:
    - Criada página de [Política de Privacidade](/politica-de-privacidade) no site.
    - Gerado checklist de assets necessários (ícones, screenshots).

## Como Testar

### 1. Site

Acesse a página de [Política de Privacidade](https://imoveis-caragua.vercel.app/politica-de-privacidade) para confirmar que o deploy do Vercel funcionou.

### 2. Mobile

Baixe o arquivo `.aab` do [Painel da Expo](https://expo.dev/accounts/marcelodifoggiajunior/projects/mobile/builds).
_Nota: Para testar no seu celular antes da loja, você precisaria gerar um APK (`eas build -p android --profile preview`), mas o foco agora foi o arquivo de publicação._

## Próximos Passos

1.  Aguardar verificação da conta Google.
2.  Preencher a ficha do app na Play Store (usando o checklist criado).
3.  Fazer upload do `.aab` na faixa de Produção.
