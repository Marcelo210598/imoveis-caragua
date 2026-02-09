"use client";

import { deletePost } from "@/app/actions/blog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTransition } from "react";

export function DeletePostButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este post?")) return;

    startTransition(async () => {
      const result = await deletePost(id);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("Post excluído com sucesso");
      }
    });
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={isPending}
      className="ml-2"
    >
      <Trash2 className="w-4 h-4" />
    </Button>
  );
}
