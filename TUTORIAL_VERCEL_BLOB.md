# Tutorial: Configurando o Vercel Blob (Armazenamento de Imagens)

Para que o upload de imagens do blog funcione, você precisa configurar o **Vercel Blob** e adicionar o token de acesso (`BLOB_READ_WRITE_TOKEN`) nas variáveis de ambiente.

Siga os passos abaixo:

## Passo 1: Criar o Banco de Dados Blob no Vercel

1.  Acesse o painel do seu projeto na [Vercel](https://vercel.com/dashboard).
2.  Vá para a aba **Storage** (Armazenamento) no menu superior.
3.  Clique no botão **Create Database** (ou "Connect Store").
4.  Selecione **Blob** na lista de opções.
5.  Dê um nome para o seu banco (ex: `litoral-norte-blob`) e clique em **Create**.

## Passo 2: Copiar o Token de Acesso

1.  Após criar, você será redirecionado para a página do Blob que acabou de criar.
2.  Procure pela seção **Environment Variables** ou **Quickstart**.
3.  Você verá um código que começa com `.env.local`.
4.  Copie o valor da variável `BLOB_READ_WRITE_TOKEN`.
    - O token se parece com: `vercel_blob_rw_xxxxxxxxxxxxxxxx`

## Passo 3: Adicionar nas Configurações do Projeto (Produção)

Este passo é essencial para que o site funcione online.

1.  Vá para a aba **Settings** (Configurações) do seu projeto na Vercel.
2.  No menu lateral esquerdo, clique em **Environment Variables**.
3.  Adicione uma nova variável:
    - **Key (Nome):** `BLOB_READ_WRITE_TOKEN`
    - **Value (Valor):** Cole o token que você copiou no Passo 2.
4.  Marque as opções **Production**, **Preview** e **Development**.
5.  Clique em **Save**.

## Passo 4: Redeploy (Importante!)

Para que as novas variáveis tenham efeito, você precisa fazer um novo deploy.

1.  Vá para a aba **Deployments**.
2.  Encontre o último deploy (o que está no topo).
3.  Clique nos três pontinhos (`...`) ao lado dele e selecione **Redeploy**.
4.  Aguarde o processo finalizar.

## Passo 5: Configuração Local (Opcional, para testar no seu computador)

Se você quiser testar o upload rodando o projeto no seu computador (`npm run dev`):

1.  Abra o arquivo `.env` na raiz do projeto no seu VS Code.
2.  Adicione uma nova linha no final do arquivo:
    ```env
    BLOB_READ_WRITE_TOKEN="seu_token_copiado_aqui"
    ```
3.  Salve o arquivo e reinicie o servidor local (pare com `Ctrl+C` e rode `npm run dev` novamente).

---

### Pronto! 🚀

Agora o upload de imagens no blog deve funcionar perfeitamente, tanto para capas de posts quanto para imagens dentro do conteúdo.
