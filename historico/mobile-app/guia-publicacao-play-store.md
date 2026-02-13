# Guia: Publicar o App na Google Play Store

> **Status**: Sprint 14 concluída. Falta apenas estes 3 passos manuais.
> **Data**: 13/02/2026

---

## Passo 1: Tirar Screenshots do App (5 min)

O Google Play exige **no mínimo 2 capturas de tela** do app para exibir na página da loja.

### Como fazer:

**Opção A — No celular (mais fácil):**

1. Abra `https://imoveis-caragua.vercel.app` no navegador do celular
2. Tire print das telas:
   - **Tela inicial** (homepage com hero e cards)
   - **Página de busca** (listagem com filtros)
   - **Detalhe do imóvel** (galeria + info) _(opcional, mas recomendado)_
3. Salve os prints em algum lugar acessível (Google Drive, etc.)

**Opção B — No computador (simulando celular):**

1. Abra `https://imoveis-caragua.vercel.app` no Chrome
2. Pressione `F12` (abre DevTools)
3. Clique no ícone de celular/tablet (Toggle Device Toolbar) ou `Cmd+Shift+M`
4. Escolha resolução: `1080 x 1920` (proporção 9:16)
5. Navegue pelas telas e tire print com `Cmd+Shift+4` (Mac)

### Requisitos:

- **Tamanho**: mínimo 320px, máximo 3840px
- **Proporção**: 9:16 (vertical) — ex: 1080x1920
- **Formato**: PNG ou JPEG
- **Quantidade**: mínimo 2, máximo 8

---

## Passo 2: Gerar o Build `.aab` (10 min)

O `.aab` (Android App Bundle) é o arquivo que o Google Play aceita para publicar o app.

### Como fazer:

1. Abra o terminal na pasta do projeto
2. Entre na pasta mobile:
   ```bash
   cd mobile
   ```
3. Rode o build de produção:
   ```bash
   eas build -p android --profile production
   ```
4. Aguarde a build finalizar na nuvem da Expo (uns 10-15 min)
5. Quando terminar, copie o **link de download** que aparece no terminal
6. Ou acesse: https://expo.dev/accounts/marcelodifoggiajunior/projects/mobile/builds

> **Nota**: Se não tiver o EAS CLI instalado, rode primeiro:
>
> ```bash
> npm install -g eas-cli
> eas login
> ```

---

## Passo 3: Upload no Google Play Console (15 min)

### 3.1 — Acessar o Console

1. Vá para https://play.google.com/console
2. Faça login com sua conta Google de desenvolvedor

### 3.2 — Criar o App

1. Clique em **"Criar app"**
2. Preencha:
   - **Nome**: `Litoral Norte Imóveis`
   - **Idioma**: Português (Brasil)
   - **Tipo**: App
   - **Gratuito**
3. Aceite as declarações

### 3.3 — Ficha da Loja (Store Listing)

Todos os textos estão prontos no arquivo `mobile/store-listing.md`. Basta copiar e colar:

| Campo              | Onde está                                              |
| ------------------ | ------------------------------------------------------ |
| Nome do app        | `mobile/store-listing.md` → seção "Nome do App"        |
| Descrição curta    | `mobile/store-listing.md` → seção "Descrição Curta"    |
| Descrição completa | `mobile/store-listing.md` → seção "Descrição Completa" |
| Ícone (512x512)    | `mobile/assets/icon-512.png`                           |
| Feature Graphic    | `mobile/assets/feature-graphic.png`                    |
| Screenshots        | Os que você tirou no Passo 1                           |

### 3.4 — Política de Privacidade

- Na seção "Política de Privacidade" do Console, cole:
  ```
  https://imoveis-caragua.vercel.app/politica-de-privacidade
  ```

### 3.5 — Upload do Build

1. Vá em **Produção** (ou **Teste interno** se quiser testar antes)
2. Clique em **"Criar nova versão"**
3. Faça upload do arquivo `.aab` que você baixou no Passo 2
4. Preencha as notas da versão:
   ```
   Versão inicial do Litoral Norte Imóveis.
   Busque imóveis no Litoral Norte de SP com filtros avançados.
   ```
5. Clique em **"Revisar versão"** → **"Iniciar lançamento"**

### 3.6 — Classificação de Conteúdo

1. Na seção "Classificação de conteúdo", preencha o questionário
2. O app é "Todos" (livre) — sem violência, sem conteúdo adulto

---

## Arquivos de Referência

| Arquivo                                        | O que contém                               |
| ---------------------------------------------- | ------------------------------------------ |
| `mobile/store-listing.md`                      | Textos prontos para copiar no Play Console |
| `mobile/assets/icon-512.png`                   | Ícone do app (512x512)                     |
| `mobile/assets/feature-graphic.png`            | Imagem de destaque da loja                 |
| `mobile/app.json`                              | Config do app (já atualizado)              |
| `historico/mobile-app/checklist-play-store.md` | Checklist completo                         |
