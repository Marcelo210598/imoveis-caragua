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
    title:
      "Morar em Caraguatatuba: Guia Definitivo e Atualizado dos Melhores Bairros",
    excerpt:
      "Pensando em se mudar para o litoral? Preparamos um guia detalhado sobre os bairros de Caraguatatuba, analisando segurança, infraestrutura e valorização para você fazer a escolha certa.",
    content: `# Morar em Caraguatatuba: O Guia Definitivo para sua Mudança

Caraguatatuba, ou simplesmente "Caraguá", deixou de ser apenas uma cidade de veraneio para se tornar um dos principais polos de desenvolvimento do Litoral Norte de São Paulo. Com a duplicação da Rodovia dos Tamoios e a crescente infraestrutura de serviços, muitas famílias estão trocando a capital pela qualidade de vida que a cidade oferece.

Mas como escolher o bairro ideal? Cada região de Caraguá tem uma "personalidade" diferente. Vamos detalhar as melhores opções.

## 1. Indaiá: O Coração Residencial
O Indaiá é, sem dúvidas, um dos bairros mais procurados por quem busca moradia fixa. 

**Por que escolher o Indaiá?**
- **Infraestrutura Completa:** Escolas, padarias, farmácias e supermercados a poucos metros de casa.
- **A Orla:** A praia do Indaiá possui um calçadão excelente para caminhadas e ciclovia, sendo o ponto de encontro de famílias no fim da tarde.
- **Perfil do Imóvel:** Aqui predominam casas térreas com terrenos amplos, mas novos edifícios de médio padrão começam a surgir.

## 2. Martim de Sá: Agito e Valorização
Se você busca um imóvel que também sirva como investimento para locação de temporada, o Martim de Sá é o campeão.

**Destaques:**
- **Vida Noturna:** É onde tudo acontece. Bares, quiosques e restaurantes movimentam a região.
- **Praia:** Uma das mais belas e frequentadas da cidade.
- **Potencial de Renda:** A alta demanda turística garante boa ocupação em plataformas como Airbnb.

## 3. Centro: Praticidade Urbana
Morar no Centro significa fazer tudo a pé. Ideal para quem trabalha na região ou prefere não depender de carro.

- **Serviços:** Bancos, Poupatempo, Hospital Santos Dumont e comércio variado.
- **Revitalização:** A Praça Cândido Mota e o entorno foram revitalizados, trazendo mais segurança e charme.

## 4. Massaguaçu e Cocanha: O Refúgio da Zona Norte
Para quem busca tranquilidade e contato com a natureza, a Zona Norte é o destino.

- **Massaguaçu:** Bairro em franca expansão com condomínios fechados de alto padrão. A praia de tombo é famosa pela pesca de arremesso.
- **Cocanha:** Ao lado do Massaguaçu, oferece uma praia de águas calmas, ideal para crianças e esportes náuticos.

## Conclusão: Qual o seu perfil?
- **Família com crianças?** Indaiá ou Centro (pelas escolas).
- **Investidor/Veraneio?** Martim de Sá.
- **Aposentadoria/Sossego?** Massaguaçu ou Condomínios da Zona Norte.

[Explore imóveis em Caraguatatuba agora](/imoveis?city=Caraguatatuba)
`,
    coverImage:
      "https://images.unsplash.com/photo-1596436750361-b1e16c96a17b?q=80&w=1200",
    published: true,
    publishedAt: new Date(),
  },
  {
    title: "Financiamento Imobiliário no Litoral: Guia Passo a Passo para 2026",
    excerpt:
      "Desmistificamos o processo de financiamento para imóveis de praia. Entenda a diferença entre SFH e SFI, documentos necessários e como usar seu FGTS.",
    content: `# Como Financiar seu Imóvel na Praia em 2026

Realizar o sonho da casa na praia está mais acessível, mas o processo burocrático ainda assusta muitos compradores. Neste guia, vamos simplificar cada etapa do financiamento imobiliário.

## 1. Entenda as Modalidades de Crédito

### SFH (Sistema Financeiro da Habitação)
É a modalidade mais vantajosa, regulada pelo governo.
- **Limite do Imóvel:** Até R$ 1.5 milhão.
- **Juros:** Limitados a 12% ao ano (geralmente menores).
- **Recursos:** Permite uso do **FGTS** (Fundo de Garantia) como entrada ou amortização.

### SFI (Sistema de Financiamento Imobiliário)
Utilizado para imóveis de alto padrão (acima de R$ 1.5 mi) ou para quem não se enquadra nas regras do SFH.
- **Taxas:** Livres, negociadas diretamente com o banco.
- **Flexibilidade:** Menor burocracia, mas custos podem ser maiores.

## 2. Documentação Obrigatória (Checklist)

Para não perder tempo, organize esta pasta antes mesmo de escolher o imóvel:
- **Pessoais:** RG, CPF, Certidão de Nascimento ou Casamento.
- **Renda (CLT):** 3 últimos holerites e Carteira de Trabalho.
- **Renda (Autônomo/Empresário):** Extratos bancários (6 meses), Decore ou Imposto de Renda completo.
- **Residência:** Comprovante atualizado.

## 3. Custos Extras: Não Esqueça Deles!
Muitos compradores focam apenas na entrada e parcela, mas existem custos cartoriais que representam cerca de **4% a 5% do valor do imóvel**:

- **ITBI (Imposto de Transmissão de Bens Imóveis):** Em Caraguatatuba, a alíquota gira em torno de 2% a 3%.
- **Registro de Imóveis:** Taxa tabelada pelo estado.
- **Avaliação Bancária:** Taxa cobrada pelo banco para vistoria do engenheiro.

> **Dica de Ouro:** Imóveis novos (primeira aquisição) podem ter desconto de 50% nas taxas de registro em cartório (Art. 290 da Lei 6.015/73). Consulte seu corretor!

## Vale a pena financiar imóvel de veraneio?
Sim, se o imóvel tiver potencial de locação. Muitas vezes, a renda obtida com aluguel de temporada (Airbnb/Booking) cobre a parcela do financiamento e os custos fixos (IPTU/Condomínio).

[Simule seu financiamento com nossa equipe](/contato)
`,
    coverImage:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200",
    published: true,
    publishedAt: new Date(),
  },
  {
    title: "Nova Tamoios e o Boom Imobiliário no Litoral Norte",
    excerpt:
      "A entrega dos Contornos da Tamoios revolucionou o acesso ao Litoral Norte. Veja como isso impactou os preços e por que ainda é hora de investir.",
    content: `# A Nova Tamoios e a Revolução Imobiliária

Quem frequentava o Litoral Norte há 10 anos lembra do pesadelo que era a descida da serra em feriados. Horas de congestionamento que desanimavam qualquer turista. Com a entrega da Nova Tamoios e, mais recentemente, dos **Contornos de Caraguatatuba e São Sebastião**, esse cenário mudou radicalmente.

## O Que Mudou na Prática?
- **Tempo de Viagem:** De São José dos Campos a Caraguatatuba em cerca de 40 minutos, com segurança de rodovia moderna.
- **Acesso a São Sebastião:** O contorno eliminou o trânsito urbano de Caraguá para quem vai para Maresias ou Ilhabela.

## Impacto Direto no Mercado Imobiliário

### 1. Valorização Imediata
Bairros próximos aos acessos dos contornos (como o Perequê-Mirim e Pegorelli) viram uma valorização expressiva terrenos. Mas a valorização foi geral: com o acesso facilitado, a demanda por imóveis de fim de semana explodiu.

### 2. O Fenômeno do "Home Office de Praia"
Com a proximidade da capital (cerca de 2h/2h30 de SP), tornou-se viável morar na praia e subir a serra apenas para reuniões pontuais. Isso mudou o perfil dos imóveis buscados: hoje, **internet fibra ótica** e **espaço para escritório** são itens obrigatórios.

### 3. Atratividade para Investidores
Grandes construtoras voltaram seus olhos para a região. O número de lançamentos verticais (prédios) em Caraguatatuba triplicou nos últimos 3 anos.

## Projeção para os Próximos Anos
Especialistas indicam que a curva de valorização ainda não atingiu o pico. Com a consolidação do turismo internacional e melhoria contínua da infraestrutura, comprar um imóvel no Litoral Norte hoje ainda é considerado um investimento de **alto potencial de retorno**.

`,
    coverImage:
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200",
    published: true,
    publishedAt: new Date(),
  },
  {
    title: "Decoração para Casa de Praia: Beleza que Resiste à Maresia",
    excerpt:
      "Maresia não perdoa! Aprenda a escolher os materiais certos para decorar sua casa de praia unindo estilo, conforto e durabilidade.",
    content: `# Decoração de Praia: Durabilidade e Estilo

Decorar uma casa no litoral exige um pensamento extra: a maresia. O ar salino e a alta umidade são implacáveis com certos materiais. Mas isso não significa abrir mão da beleza.

## Materiais: O Que Usar e O Que Evitar

### ✅ USE:
- **Aço Inox (304 ou 316):** Essencial para eletrodomésticos e ferragens.
- **Alumínio com Pintura Eletrostática:** Ótimo para esquadrias e móveis externos.
- **Madeira de Lei ou Tratada:** Cumaru, Ipê e Eucalipto tratado resistem bem.
- **Fibras Sintéticas:** Imitam o visual natural (palha/vime) mas duram muito mais.
- **Tecidos:** Acquablock ou Sunbrella para áreas externas. Linho e algodão para internas.

### ❌ EVITE:
- **Ferro não tratado:** Enferruja em semanas.
- **Tecidos pesados (Veludo/Camurça):** Mofam com facilidade e acumulam calor.
- **Móveis de MDP sem proteção:** Inchham com a umidade.

## Paleta de Cores e Estilo

A tendência atual foge do clichê "temático náutico" (âncoras e listras azuis).
O **Estilo Boho Litorâneo** está em alta:
- Tons terrosos claros (areia, palha, terracota suave).
- Muito branco para refletir a luz.
- Texturas naturais (tapetes de sisal, cestos de palha).
- Verde das plantas (costela de adão, palmeiras) para trazer frescor.

## Integração é a Chave
Na praia, a barreira entre dentro e fora é tênue. Use portas de vidro amplas, nivele o piso da sala com a varanda e crie um fluxo contínuo. A cozinha integrada (americana) é quase obrigatória para manter o cozinheiro participando da conversa.

`,
    coverImage:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200",
    published: true,
    publishedAt: new Date(),
  },
  {
    title: "Casa vs Apartamento no Litoral: O Comparativo Sincero",
    excerpt:
      "Segurança, custo de manutenção, privacidade... Colocamos na balança os prós e contras de cada opção para te ajudar a decidir sem arrependimentos.",
    content: `# Casa ou Apartamento: O Eterno Dilema do Litoral

Está em dúvida entre a liberdade de uma casa e a praticidade de um apartamento? Essa é a dúvida número 1 dos nossos clientes. Para ajudar, criamos um comparativo sincero baseado na experiência de centenas de compradores.

## 1. Manutenção (O Fator "Dor de Cabeça")

- **Apartamento:** 🏆 Vencedor.
  A fachada, telhado, piscina e jardins são problemas do síndico/zelador. Você só cuida da porta para dentro. Ideal para quem vai pouco à praia e não quer chegar e ter que limpar a piscina antes de usar.
  
- **Casa:**
  Exige dedicação. Limpeza de piscina, corte de grama, calhas, pintura externa... Se você não mora lá, precisará contratar um caseiro ou jardineiro mensal.

## 2. Custos Fixos (O Bolso)

- **Casa (Fora de Condomínio):** 🏆 Vencedora (tecnicamente).
  Só paga IPTU e consumos. Sem taxa de condomínio.
  *Porém, considere o custo de alarmes, cercas elétricas e monitoramento.*

- **Apartamento / Casa em Condomínio:**
  Tem a taxa mensal. Em prédios com muita estrutura (Lazer Club), pode ser alta (R$ 800 a R$ 2.000). Mas divide-se os custos de segurança e lazer.

## 3. Segurança

- **Apartamento:** 🏆 Vencedor.
  Portaria 24h, câmeras, vizinhos próximos. Pode viajar tranquilo e deixar o imóvel fechado por meses.

- **Casa de Rua:**
  Mais vulnerável, especialmente se ficar vazia por longos períodos. Exige investimento em segurança eletrônica.

## 4. Privacidade e Lazer

- **Casa:** 🏆 Vencedora.
  Churrasco na beira da piscina sem hora para acabar, sem vizinho reclamando do barulho (dentro do razoável), espaço para os cachorros correrem. É a experiência completa de "casa de praia".

- **Apartamento:**
  Regras de condomínio, horário da piscina, barulho do vizinho de cima.

## Veredito LN Imóveis

- Escolha **Apartamento** se: Você busca praticidade, segurança total e quer chegar na sexta-feira à noite e só descansar.
- Escolha **Casa** se: Você tem família grande, pets, gosta de receber muitos amigos e não se importa em gerenciar a manutenção (ou pagar alguém para isso).

[Veja opções de Casas](/imoveis?type=casa) | [Veja opções de Apartamentos](/imoveis?type=apartamento)
`,
    coverImage:
      "https://images.unsplash.com/photo-1494526585098-91620207978a?q=80&w=1200",
    published: true,
    publishedAt: new Date(),
  },
];

async function main() {
  console.log("🌱 Seeding Blog Posts V2 (High Quality)...");

  const author =
    (await prisma.user.findFirst({
      where: { role: "ADMIN" },
    })) || (await prisma.user.findFirst());

  if (!author) {
    console.error("❌ Nenhum usuário encontrado para ser autor.");
    return;
  }

  for (const post of initialPosts) {
    const slug = localSlugify(post.title);

    // Upsert: Create or Update if exists
    // We use slug as unique identification
    await prisma.blogPost.upsert({
      where: { slug },
      update: {
        title: post.title,
        content: post.content,
        excerpt: post.excerpt,
        coverImage: post.coverImage,
        // Setup SEO fields too
        seoTitle: post.title,
        seoDescription: post.excerpt,
      },
      create: {
        ...post,
        slug,
        authorId: author.id,
        seoTitle: post.title,
        seoDescription: post.excerpt,
      },
    });
    console.log(`✅ Post atualizado/criado: ${post.title}`);
  }

  console.log("✨ Seed V2 concluído!");
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
