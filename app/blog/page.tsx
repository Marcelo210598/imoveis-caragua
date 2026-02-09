import { getPosts } from "@/app/actions/blog";
import Link from "next/link";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Imobiliário Litoral Norte | Dicas e Notícias",
  description:
    "Notícias do mercado imobiliário, dicas de decoração e guias de bairros de Caraguatatuba e região.",
};

export default async function BlogPage() {
  const { posts } = await getPosts(1, 20, true); // Published only

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Blog Imobiliário</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Fique por dentro das novidades do mercado imobiliário, dicas para seu
          lar e tudo sobre o Litoral Norte.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <h2 className="text-2xl font-semibold mb-2">Em breve!</h2>
          <p className="text-muted-foreground">
            Estamos preparando conteúdos incríveis para você.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48 w-full bg-muted">
                {post.coverImage ? (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground bg-gray-100 dark:bg-gray-800">
                    <span className="text-4xl">📰</span>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 leading-tight">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </CardTitle>
                {post.publishedAt && (
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.publishedAt).toLocaleDateString("pt-BR")}
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {post.excerpt ||
                    post.seoDescription ||
                    "Leia este artigo completo para saber mais."}
                </p>
              </CardContent>
              <CardFooter>
                <Link href={`/blog/${post.slug}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    Ler Artigo
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
