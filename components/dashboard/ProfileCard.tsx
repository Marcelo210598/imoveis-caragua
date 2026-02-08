"use client";

import { useState } from "react";
import { User, Phone, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfileCardProps {
  user: {
    id: string;
    name: string | null;
    phone: string | null;
    avatarUrl: string | null;
  };
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || "",
    phone: user.phone || "",
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Erro ao atualizar perfil");

      toast.success("Perfil atualizado com sucesso!");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Erro ao salvar alterações");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const initials = (user.name || "U").substring(0, 2).toUpperCase();

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 h-24 sm:h-32 relative">
        <div className="absolute -bottom-10 left-4 sm:left-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white dark:border-gray-800 bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400 text-2xl sm:text-3xl font-bold overflow-hidden">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name || "Avatar"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        </div>
      </div>

      <div className="pt-12 pb-6 px-4 sm:px-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            {isEditing ? (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 font-medium">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="block w-full text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none px-0 py-1"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium">
                    Telefone (WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="block w-full text-sm text-gray-600 dark:text-gray-300 bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:outline-none px-0 py-1"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user.name || "Usuário"}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm mt-1">
                  <Phone size={14} />
                  <span>{user.phone || "Sem telefone cadastrado"}</span>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isLoading}
            className={`p-2 rounded-full transition-colors ${
              isEditing
                ? "bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300"
            }`}
            aria-label={isEditing ? "Salvar" : "Editar"}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : isEditing ? (
              <Check size={20} />
            ) : (
              <Edit2 size={20} />
            )}
          </button>
        </div>

        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-1"
          >
            <X size={14} /> Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
