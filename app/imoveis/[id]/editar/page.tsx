import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PropertyForm from "@/components/property/PropertyForm";
import { redirect, notFound } from "next/navigation";

export default async function EditarImovelPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/entrar");
  }

  const property = await prisma.property.findUnique({
    where: { id: params.id },
    include: {
      photos: { orderBy: { order: "asc" } },
    },
  });

  if (!property) {
    notFound();
  }

  // Verificar propriedade
  if (property.ownerId !== session.user.id) {
    // Se não for dono, redirecionar (ou mostrar erro)
    redirect("/dashboard");
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Editar imóvel
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Atualize as informações do seu anúncio.
        </p>
      </div>
      <PropertyForm initialData={property} />
    </div>
  );
}
