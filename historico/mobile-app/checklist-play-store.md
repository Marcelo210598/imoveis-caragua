# Checklist de Publicação Google Play Store

## 1. Configurações do App (`app.json`)

- [x] **Package Name**: `com.litoralnorte.app`
- [x] **Version Code**: 2 (incremental para cada update)
- [x] **Adaptive Icon**: Ícone de fundo e frente separados (Android 12+)
- [ ] **Permissions**: Rever permissões em `android.permissions` (ACCESS_FINE_LOCATION, CAMERA, etc. se usado)

## 2. Conteúdo da Loja (Play Console)

- [ ] **Nome do App**: Limite de 30 caracteres. Ex: "Litoral Norte Imóveis"
- [ ] **Descrição Curta**: Limite de 80 caracteres. Ex: "Encontre a casa dos seus sonhos no Litoral Norte de SP."
- [ ] **Descrição Completa**: Detalhes sobre o app, buscas, filtros, contato direto.
- [ ] **Ícone do App**: 512x512 px (PNG/JPEG), até 1MB.
- [ ] **Feature Graphic (Imagem de Destaque)**: 1024x500 px (PNG/JPEG).

## 3. Screenshots (Capturas de Tela)

_Mínimo de 2 screenshots por tipo de dispositivo suportado._

- [ ] **Celular**: Proporção 9:16 (ex: 1080x1920)
- [ ] **Tablet 7"**: (Opcional, mas recomendado)
- [ ] **Tablet 10"**: (Opcional, mas recomendado)

## 4. Política de Privacidade

_Obrigatório para apps que solicitam permissões sensíveis ou dados de usuário._

- [ ] Criar página `/politica-de-privacidade` no site.
- [ ] Inserir link no Play Console.

## 5. Testes

- [ ] Teste Interno: Versão para sua conta e equipe.
- [ ] Teste Fechado: Pequeno grupo de usuários convidados.
- [ ] Produção: Lançamento para o público geral.
