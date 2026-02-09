import { getPostBySlug } from "@/app/actions/blog";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import { Metadata } from "next";

// Force dynamic rendering if needed, or rely on revalidation
// export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Artigo não encontrado",
    };
  }

  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.excerpt || undefined,
      images: post.coverImage ? [post.coverImage] : [],
      type: "article",
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author?.name ? [post.author.name] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);

  const isDraft = post && !post.published;
  const isProduction = process.env.NODE_ENV === "production";

  if (!post || (isDraft && isProduction)) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <article className="max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm overflow-hidden pb-8">
        {post.coverImage && (
          <div className="relative w-full h-[400px] md:h-[500px]">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-6 md:p-10">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
            {post.publishedAt && (
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
              </div>
            )}
            {post.author && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                {post.author.name || "Equipe"}
              </div>
            )}
            {!post.published && (
              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-bold uppercase">
                Rascunho
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {/* Simple Markdown Rendering - in future use a library */}
            {/* For now, just preserving whitespace and basic paragraphs */}
            {post.content.split("\n").map((line, i) => {
              if (line.startsWith("# "))
                return (
                  <h1 key={i} className="text-3xl font-bold mt-8 mb-4">
                    {line.replace("# ", "")}
                  </h1>
                );
              if (line.startsWith("## "))
                return (
                  <h2 key={i} className="text-2xl font-bold mt-6 mb-3">
                    {line.replace("## ", "")}
                  </h2>
                );
              if (line.startsWith("### "))
                return (
                  <h3 key={i} className="text-xl font-bold mt-5 mb-2">
                    {line.replace("### ", "")}
                  </h3>
                );
              if (line.startsWith("- "))
                return (
                  <li key={i} className="ml-4 list-disc">
                    {line.replace("- ", "")}
                  </li>
                );
              if (line.trim() === "")
                return <div key={i} className="h-4"></div>;
              return (
                <p key={i} className="mb-4 leading-relaxed">
                  {line}
                </p>
              );
            })}
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto mt-12 mb-12 p-8 bg-primary/5 rounded-2xl border border-primary/20 text-center">
        <h3 className="text-2xl font-bold mb-4">
          Procurando imóvel no Litoral Norte?
        </h3>
        <p className="mb-6 text-muted-foreground">
          Temos as melhores opções de casas e apartamentos para venda e locação
          em Caraguatatuba e região.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/imoveis">
            <Button size="lg" className="w-full sm:w-auto">
              Ver Imóveis
            </Button>
          </Link>
          <Link href="/contato">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Fale Conosco
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
