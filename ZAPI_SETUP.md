# 🔧 Setup Z-API - Autenticação via WhatsApp

Este guia explica como configurar a Z-API para enviar códigos de autenticação via WhatsApp.

## 📋 O que é Z-API?

A **Z-API** é um serviço que permite enviar mensagens de WhatsApp programaticamente.
- **Site**: https://z-api.io/
- **Custo**: Grátis até 100 mensagens/dia, depois ~R$ 0,05 por mensagem
- **Vantagem**: Usa teu número de WhatsApp pessoal ou business

---

## 🚀 Passo a Passo de Configuração

### 1. Criar conta na Z-API

1. Acesse: https://z-api.io/
2. Clique em "Criar conta gratuita"
3. Faça cadastro com e-mail e senha
4. Confirme o e-mail

### 2. Criar Instância

1. No painel da Z-API, clique em "Instâncias"
2. Clique em "Criar nova instância"
3. Dê um nome (ex: "Litoral Norte Imóveis")
4. Escolha o plano **FREE** (100 msg/dia)
5. Clique em criar

### 3. Conectar WhatsApp via QR Code

1. Na tela da instância, clique em "Conectar WhatsApp"
2. Vai aparecer um **QR Code**
3. Abre o WhatsApp no teu celular
4. Vai em **Configurações → Aparelhos conectados → Conectar**
5. Escaneia o QR Code
6. Pronto! Teu WhatsApp está conectado à Z-API

### 4. Obter Credenciais

No painel da instância, copia:
- **Instance ID**: Ex: `123456789-A1B2C3D4`
- **Instance Token**: Ex: `seu_token_aqui123`

### 5. Configurar Token de Segurança (Client Token) ⚠️ **OBRIGATÓRIO**

1. No menu lateral, clique em **Segurança**
2. Na seção **"3. Token de segurança da conta"**, clique em **"Configurar agora"**
3. A Z-API vai gerar um **Client Token**
4. Copie esse token (ex: `F063e1a53db3c4061bd9b8dbf745f7997S`)

> **IMPORTANTE**: Sem esse token, a API retorna erro `"client-token is not configured"`

### 6. Configurar Variáveis de Ambiente

No arquivo `.env.local`, adiciona:

```bash
ZAPI_INSTANCE_ID="seu_instance_id_aqui"
ZAPI_INSTANCE_TOKEN="seu_token_aqui"
ZAPI_CLIENT_TOKEN="seu_client_token_aqui"
```

### 6. Testar Conexão

```bash
# Testa se está funcionando
curl http://localhost:3000/api/test/zapi
```

Resposta esperada:
```json
{
  "success": true,
  "message": "Conexão Z-API estabelecida com sucesso!",
  "instanceInfo": { ... }
}
```

### 7. Testar Envio de OTP

```bash
curl -X POST http://localhost:3000/api/test/zapi \
  -H "Content-Type: application/json" \
  -d '{"phone": "5512988888888"}'
```

Tu vais receber uma mensagem no WhatsApp com o código!

---

## 📱 Fluxo de Autenticação

1. Usuário entra no site
2. Digita o telefone: `(12) 98888-8888`
3. Sistema envia WhatsApp com código: `123456`
4. Usuário digita o código no site
5. Login realizado com sucesso!

---

## 💰 Custos

| Plano | Mensagens | Preço |
|-------|-----------|-------|
| **FREE** | 100/dia | R$ 0,00 |
| **START** | 1.000/mês | ~R$ 50,00 |
| **PRO** | 5.000/mês | ~R$ 150,00 |
| **Pay-per-use** | Cada | ~R$ 0,05 |

**Recomendação**: Começa no FREE, só paga se precisar de mais volume.

---

## ⚠️ Importante

- O WhatsApp conectado à Z-API não pode ser o mesmo que usa pessoalmente no dia a dia
- Recomenda-se criar um WhatsApp Business exclusivo para o sistema
- Se o WhatsApp ficar offline, a Z-API para de funcionar
- Mantém o celular conectado à internet (ou usa WhatsApp Cloud se tiver)

---

## 🔧 Troubleshooting

### Erro: "Instância Z-API inválida"
- Verifica se `ZAPI_INSTANCE_ID` está correto
- Copia novamente do painel Z-API

### Erro: "Token incorreto"
- Verifica se `ZAPI_INSTANCE_TOKEN` está correto
- Gera novo token no painel Z-API se necessário

### Erro: "client-token is not configured"
- **Problema mais comum!** Você precisa configurar o Token de Segurança
- Vá em: **Segurança > Token de segurança da conta > Configurar agora**
- Copie o token gerado e adicione ao `.env.local` como `ZAPI_CLIENT_TOKEN`

### Erro: "NOT_FOUND" ao enviar mensagem
- Verifique se o formato da URL está correto: `/instances/{id}/token/{token}/send-text`
- O telefone deve ir no **body** da requisição, não na URL
- Body JSON deve conter: `{"phone": "5512988888888", "message": "..."}`

### Mensagem não chega
- Verifica se o WhatsApp está conectado (escaneia QR Code novamente)
- Confirma que o número está no formato correto: `5512988888888`
- Checa se atingiu limite diário do plano FREE

---

## 🚀 Próximo Passos

Após configurar Z-API:
1. Testa login em desenvolvimento
2. Valida fluxo completo
3. Deploy em produção
4. Monitora uso no painel Z-API

---

## 📞 Suporte

- **Z-API**: suporte@z-api.io
- **Documentação**: https://docs.z-api.io/
- **Discord**: https://discord.gg/z-api

---

**Data de criação**: 17/02/2026
**Versão**: 1.0
