import { BlogEditor } from "../BlogEditor"; // Correct import path assuming directory structure
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

// Since BlogEditor is one level up, import path is correct.

export default async function EditPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await prisma.blogPost.findUnique({
    where: { id: params.id },
  });

  if (!post) {
    notFound();
  }

  // Convert post dates to strings or keep as Date. Components usually handle Date or ISO string.
  // Serialization boundary (server -> client) requires JSON serializable.
  // Prisma dates are Date objects. Server Components -> Client Components transition serializes them automatically in recent Next.js versions but sometimes issues arise.
  // I will pass the post object directly to BlogEditor which is a Client Component.

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Editar Post</h1>
      <BlogEditor post={post} />
    </div>
  );
}
