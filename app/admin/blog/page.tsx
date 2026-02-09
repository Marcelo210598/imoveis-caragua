import { getPosts, deletePost } from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Assuming shadcn table exists, verifying first might be better but I'll assume standard shadcn setup. If not I will create basic table.

import Link from "next/link";
import { DeletePostButton } from "./DeletePostButton"; // Client component for delete

export default async function BlogAdminPage() {
  const { posts } = await getPosts(1, 100, false); // Get all posts

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gerenciar Blog</h1>
        <Link href="/admin/blog/novo">
          <Button>Novo Post</Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-md border">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm text-left">
            <thead className="[&_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Título
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground">
                  Data
                </th>
                <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="[&_tr:last-child]:border-0">
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-4 text-center">
                    Nenhum post encontrado.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr
                    key={post.id}
                    className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                  >
                    <td className="p-4 align-middle font-medium">
                      {post.title}
                    </td>
                    <td className="p-4 align-middle">
                      <span
                        className={`px-2 py-1 rounded text-xs ${post.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                      >
                        {post.published ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="p-4 align-middle">
                      {new Date(post.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-4 align-middle text-right gap-2 flex justify-end">
                      <Link href={`/admin/blog/${post.id}`}>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </Link>
                      <DeletePostButton id={post.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
