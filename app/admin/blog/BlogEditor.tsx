"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // verify if existing
import { Input } from "@/components/ui/input"; // verify if existing
import { Textarea } from "@/components/ui/textarea"; // verify if existing
import { Label } from "@/components/ui/label"; // verify if existing
import { Checkbox } from "@/components/ui/checkbox"; // verify if existing
import { createPost, updatePost } from "@/app/actions/blog";
import { toast } from "sonner";
import Image from "next/image";

// Assuming types from Prisma Client or define here
type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  published: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
};

export function BlogEditor({ post }: { post?: Post }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    title: post?.title || "",
    slug: post?.slug || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    coverImage: post?.coverImage || "",
    published: post?.published || false,
    seoTitle: post?.seoTitle || "",
    seoDescription: post?.seoDescription || "",
  });
  const [uploading, setUploading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from title if slug is empty or user hasn't manually edited it much (heuristic)
    if (name === "title" && !post) {
      // Simple slug generation
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, published: checked }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setUploading(true);
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`/api/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");

      const newBlob = await response.json();
      setFormData((prev) => ({ ...prev, coverImage: newBlob.url }));
      toast.success("Imagem enviada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar imagem");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      // Validate schema client-side if needed, but actions handle it too.
      // We will let the server action validate.

      const payload = {
        ...formData,
        excerpt: formData.excerpt || undefined,
        coverImage: formData.coverImage || undefined,
        seoTitle: formData.seoTitle || undefined,
        seoDescription: formData.seoDescription || undefined,
      };

      let result;
      if (post) {
        result = await updatePost(post.id, payload);
      } else {
        result = await createPost(payload);
      }

      if (result.error) {
        if (typeof result.error === "string") {
          toast.error(result.error);
        } else {
          // Zod errors object
          toast.error("Erro na validação. Verifique os campos.");
          console.error(result.error);
        }
      } else {
        toast.success(post ? "Post atualizado!" : "Post criado!");
        router.push("/admin/blog");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl bg-white dark:bg-gray-900 p-6 rounded-lg shadow"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
            className="text-gray-900 dark:text-gray-100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="coverImage">Imagem de Capa</Label>
        <div className="flex items-center gap-4">
          <Input
            id="coverImageFile"
            type="file"
            onChange={handleImageUpload}
            disabled={uploading}
            accept="image/*"
            className="max-w-xs text-gray-900 dark:text-gray-100"
          />
          {uploading && (
            <span className="text-sm text-muted-foreground">Enviando...</span>
          )}
        </div>

        {formData.coverImage && (
          <div className="mt-2 relative w-full h-48 md:h-64 rounded-md overflow-hidden bg-gray-100">
            <Image
              src={formData.coverImage}
              alt="Preview"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() =>
                setFormData((prev) => ({ ...prev, coverImage: "" }))
              }
            >
              Remover
            </Button>
          </div>
        )}
        <Input
          type="hidden"
          name="coverImage"
          value={formData.coverImage || ""}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Resumo (Excerpt)</Label>
        <Textarea
          id="excerpt"
          name="excerpt"
          value={formData.excerpt}
          onChange={handleChange}
          rows={3}
          className="text-gray-900 dark:text-gray-100"
        />
        <p className="text-xs text-muted-foreground">
          Aparece na listagem do blog e meta description se não definido.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Conteúdo (Markdown)</Label>
        <Textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows={15}
          className="font-mono text-gray-900 dark:text-gray-100"
        />
        <p className="text-xs text-muted-foreground">
          Use Markdown para formatar. # Título, **Negrito**, - Lista,
          [Link](url)
        </p>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-lg font-semibold mb-4">SEO</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="seoTitle">SEO Title</Label>
            <Input
              id="seoTitle"
              name="seoTitle"
              value={formData.seoTitle}
              onChange={handleChange}
              placeholder={formData.title}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescription">SEO Description</Label>
            <Textarea
              id="seoDescription"
              name="seoDescription"
              value={formData.seoDescription}
              onChange={handleChange}
              rows={2}
              placeholder={formData.excerpt}
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="published"
          checked={formData.published}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="published">Publicar imediatamente</Label>
      </div>

      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending || uploading}>
          {isPending ? "Salvando..." : post ? "Atualizar Post" : "Criar Post"}
        </Button>
      </div>
    </form>
  );
}
