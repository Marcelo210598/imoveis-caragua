import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidade | Litoral Norte Imóveis",
  description:
    "Política de privacidade e termos de uso do aplicativo Litoral Norte Imóveis.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="mb-4">
          Última atualização: {new Date().toLocaleDateString()}
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">1. Introdução</h2>
        <p>
          O aplicativo Litoral Norte Imóveis ("nós", "nosso") respeita a sua
          privacidade e está comprometido em proteger os dados pessoais que você
          compartilha conosco. Esta política descreve como coletamos, usamos e
          protegemos suas informações.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">2. Dados Coletados</h2>
        <p>Podemos coletar as seguintes informações:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Informações de conta (Nome, Telefone).</li>
          <li>
            Identificadores do dispositivo para notificações push (Token).
          </li>
          <li>Dados de navegação e preferências de imóveis.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          3. Uso das Informações
        </h2>
        <p>Utilizamos seus dados para:</p>
        <ul className="list-disc pl-5 mb-4">
          <li>Fornecer e personalizar nossos serviços.</li>
          <li>
            Enviar notificações sobre imóveis do seu interesse (apenas com sua
            permissão).
          </li>
          <li>Entrar em contato via WhatsApp para facilitar negociações.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-3">
          4. Exclusão de Dados
        </h2>
        <p>
          Você pode solicitar a exclusão da sua conta e de todos os dados
          associados a qualquer momento através das configurações do aplicativo
          ou entrando em contato conosco.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-3">5. Contato</h2>
        <p>
          Se tiver dúvidas sobre esta política, entre em contato pelo e-mail:
          contato@lnimoveis.com.br
        </p>
      </div>
    </div>
  );
}
