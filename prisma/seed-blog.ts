import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../lib/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function localSlugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const initialPosts = [
  {
    title: "Morar em Caraguatatuba: Guia Completo dos Melhores Bairros",
    excerpt:
      "Descubra quais são os melhores bairros para morar em Caraguatatuba, SP. Do Centro ao Indaiá, saiba onde investir ou comprar sua casa.",
    content: `# Morar em Caraguatatuba: Guia Completo

Caraguatatuba, carinhosamente chamada de Caraguá, é uma das cidades que mais crescem no Litoral Norte de São Paulo. Com infraestrutura completa, praias belíssimas e qualidade de vida, atrai tanto turistas quanto novos moradores.

## Melhores Bairros para Morar

### 1. Indaiá
O Indaiá é um dos bairros mais tradicionais. Com uma orla urbanizada e tranquila, é ideal para famílias e aposentados. Possui quiosques, ciclovias e é próximo ao centro.

### 2. Martim de Sá
Conhecido pela praia badalada e vida noturna, o Martim de Sá é perfeito para quem busca agito e valorização imobiliária. É um dos bairros mais procurados para aluguel de temporada.

### 3. Centro
Morar no Centro oferece a conveniência de ter tudo perto: bancos, comércios, escolas e hospitais. A revitalização da praça central trouxe ainda mais charme para a região.

### 4. Massaguaçu
Na região norte, o Massaguaçu vem se desenvolvendo rapidamente com condomínios de alto padrão e uma praia extensa de tombo, famosa pela pesca.

## Por que investir em Caraguá?
A cidade está em plena expansão com obras viárias (Contorno da Tamoios) e novos empreendimentos. O mercado imobiliário segue aquecido, sendo um ótimo momento para compra.

[Veja imóveis em Caraguatatuba](/imoveis?city=Caraguatatuba)`,
    coverImage:
      "https://images.unsplash.com/photo-1596436750361-b1e16c96a17b?q=80&w=1200", // Placeholder Unsplash Image
    published: true,
    publishedAt: new Date(),
  },
  {
    title: "Financiamento Imobiliário: Como Comprar sua Casa na Praia",
    excerpt:
      "Entenda como funciona o financiamento de imóveis no litoral e realize o sonho da casa própria.",
    content: `# Financiamento Imobiliário no Litoral

Comprar um imóvel na praia é o sonho de muitos brasileiros. Felizmente, as linhas de crédito atuais facilitam essa conquista.

## Tipos de Financiamento

- **SFH (Sistema Financeiro da Habitação)**: Utiliza recursos da poupança e FGTS. Taxas de juros limitadas a 12% ao ano. Imóveis até R$ 1.5 milhão.
- **SFI (Sistema de Financiamento Imobiliário)**: Para imóveis acima do teto do SFH, com taxas livres de mercado.

## Documentação Necessária

Para aprovar seu crédito, organize:
1. RG e CPF
2. Comprovante de Renda (Holerites ou IR)
3. Comprovante de Residência
4. Certidão de Estado Civil

Recomendamos sempre consultar um especialista para simular as melhores taxas para o seu perfil.`,
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200",
    published: true,
    publishedAt: new Date(),
  },
  {
    title: "Valorização Imobiliária no Litoral Norte Pós-Tamoios",
    excerpt:
      "Como a Nova Tamoios impactou o mercado imobiliário de Caraguatatuba e São Sebastião.",
    content: `# O Impacto da Nova Tamoios

A entrega dos contornos da Rodovia dos Tamoios transformou a logística e o turismo no Litoral Norte.

## Redução no Tempo de Viagem
O trajeto entre São José dos Campos e Caraguatatuba ficou mais rápido e seguro, incentivando o turismo de fim de semana e até moradia fixa para quem faz home office.

## Valorização dos Imóveis
Bairros próximos aos acessos da rodovia tiveram valorização expressiva. A facilidade de acesso é um dos principais fatores de decisão de compra hoje.

Se você pensa em investir, a hora é agora, antes que os preços subam ainda mais com a consolidação dessas obras.`,
    coverImage:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200",
    published: true,
    publishedAt: new Date(),
  },
  {
    title: "Dicas de Decoração para Casas de Praia",
    excerpt:
      "Torne sua casa de praia mais aconchegante e prática com essas dicas simples de decoração.",
    content: `# Decoração Praiana: Leveza e Praticidade

Uma casa de praia pede uma decoração que converse com o ambiente externo e seja fácil de manter.

## 1. Aposte em Cores Claras
Branco, bege, azul e verde trazem a sensação de frescor e amplitude.

## 2. Materiais Naturais
Use madeira, bambu, palha e fibras naturais nos móveis e objetos decorativos. Eles resistem bem à maresia se bem tratados.

## 3. Tecidos Leves
Prefira linho e algodão para cortinas e almofadas. Evite veludo ou tecidos pesados que acumulam calor e umidade.

## 4. Integração
Integre sala e varanda para criar ambientes amplos de convivência, perfeitos para receber a família e amigos.`,
    coverImage:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
    published: true,
    publishedAt: new Date(),
  },
  {
    title: "Apartamento ou Casa: Qual a melhor opção no litoral?",
    excerpt:
      "Comparativo entre viver em casa ou apartamento no litoral para te ajudar a decidir.",
    content: `# Casa x Apartamento: O Grande Dilema

Na hora de comprar no litoral, a dúvida é comum. Vamos analisar os prós e contras.

## Apartamento
**Vantagens:**
- **Segurança:** Portaria 24h e monitoramento.
- **Manutenção:** O condomínio cuida das áreas externas e lazer.
- **Praticidade:** Ideal para quem usa apenas em temporadas.

**Desvantagens:**
- Taxa de condomínio.
- Regras de convivência mais estritas.

## Casa
**Vantagens:**
- **Privacidade:** Sem vizinhos de parede.
- **Espaço:** Quintal, área para churrasqueira privativa e piscina.
- **Liberdade:** Sem taxas de condomínio (se for casa de rua).

**Desvantagens:**
- Manutenção por conta do proprietário.
- Segurança requer mais investimento (câmeras, alarmes).

A escolha depende do seu perfil e frequência de uso!`,
    coverImage:
      "https://images.unsplash.com/photo-1494526585098-91620207978a?q=80&w=1200",
    published: true,
    publishedAt: new Date(),
  },
];

async function main() {
  console.log("🌱 Seeding Blog Posts...");

  // Find a user to be the author (preferably ADMIN)
  const author =
    (await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })) || (await prisma.user.findFirst());

  if (!author) {
    console.error(
      "❌ Nenhum usuário encontrado para ser autor. Crie um usuário primeiro.",
    );
    return;
  }

  console.log(`👤 Autor: ${author.name} (${author.id})`);

  for (const post of initialPosts) {
    const slug = localSlugify(post.title);

    const exists = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (!exists) {
      await prisma.blogPost.create({
        data: {
          ...post,
          slug,
          authorId: author.id,
          seoTitle: post.title,
          seoDescription: post.excerpt,
        },
      });
      console.log(`✅ Post criado: ${post.title}`);
    } else {
      console.log(`⚠️ Post já existe: ${post.title}`);
    }
  }

  console.log("✨ Seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
