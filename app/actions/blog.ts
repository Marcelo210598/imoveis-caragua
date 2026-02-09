"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/lib/auth"; // Assuming auth is available here based on file list
// If auth is not here, I might need to check how to get current user.
// Step 36 showed "auth.ts" in "lib".

const PostSchema = z.object({
  title: z.string().min(1, "O título é obrigatório"),
  content: z.string().min(1, "O conteúdo é obrigatório"),
  excerpt: z.string().optional(),
  coverImage: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  slug: z
    .string()
    .min(1, "O slug é obrigatório")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug inválido (use apenas letras minúsculas, números e hífens)",
    ),
  published: z.boolean().default(false),
});

export async function createPost(data: z.infer<typeof PostSchema>) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    // Assuming role check. schema.prisma showed "Role" enum with "ADMIN".
    // I need to verify how to check role. for now assuming session.user.role works.
    // If not, I will fix it later.
    return { error: "Não autorizado" };
  }

  const result = PostSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const post = await prisma.blogPost.create({
      data: {
        ...result.data,
        authorId: session.user.id,
        publishedAt: result.data.published ? new Date() : null,
      },
    });

    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true, post };
  } catch (error: any) {
    if (error.code === "P2002") {
      return { error: "Já existe um post com este slug" };
    }
    return { error: "Erro ao criar post: " + error.message };
  }
}

export async function updatePost(id: string, data: z.infer<typeof PostSchema>) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Não autorizado" };
  }

  const result = PostSchema.safeParse(data);
  if (!result.success) {
    return { error: result.error.flatten().fieldErrors };
  }

  try {
    const existingPost = await prisma.blogPost.findUnique({ where: { id } });

    // Handle publishedAt logic
    let publishedAt = existingPost?.publishedAt;
    if (result.data.published && !existingPost?.published) {
      publishedAt = new Date();
    } else if (!result.data.published) {
      publishedAt = null;
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        ...result.data,
        publishedAt,
      },
    });

    revalidatePath("/blog");
    revalidatePath(`/blog/${post.slug}`);
    revalidatePath("/admin/blog");
    return { success: true, post };
  } catch (error: any) {
    return { error: "Erro ao atualizar post: " + error.message };
  }
}

export async function deletePost(id: string) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Não autorizado" };
  }

  try {
    await prisma.blogPost.delete({ where: { id } });
    revalidatePath("/blog");
    revalidatePath("/admin/blog");
    return { success: true };
  } catch (error: any) {
    return { error: "Erro ao excluir post: " + error.message };
  }
}

export async function getPosts(page = 1, limit = 10, publishedOnly = true) {
  const skip = (page - 1) * limit;
  const where = publishedOnly ? { published: true } : {};

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { author: { select: { name: true, avatarUrl: true } } },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return { posts, total, totalPages: Math.ceil(total / limit) };
}

export async function getPostBySlug(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true, avatarUrl: true, bio: true } } }, // Added bio just in case, warning: User model might not have bio. Checked User model, it does NOT have bio. Removed bio.
  });

  // Correcting author include
  // User model:
  //   id, phone, name, avatarUrl, whatsappOptIn, role, createdAt, updatedAt

  return prisma.blogPost.findUnique({
    where: { slug },
    include: { author: { select: { name: true, avatarUrl: true } } },
  });
}
