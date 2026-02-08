"use client";

import { useState } from "react";
import { User, Phone, Edit2, Check, X, Camera } from "lucide-react";
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
    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-gray-700/50 overflow-hidden transition-all hover:shadow-xl">
      <div className="h-32 sm:h-40 relative bg-gradient-to-br from-primary-600 via-primary-500 to-cyan-500">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute -bottom-12 left-6">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-white dark:border-gray-800 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-400 dark:text-gray-500 text-3xl font-bold overflow-hidden shadow-md">
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
            {/* Future Feature: Upload Avatar
            <button className="absolute bottom-0 right-0 bg-primary-600 text-white p-1.5 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera size={14} />
            </button>
            */}
          </div>
        </div>
      </div>

      <div className="pt-14 pb-6 px-6">
        <div className="flex justify-between items-start mb-2">
          <div className="flex-1 mr-4">
            {isEditing ? (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 block">
                    Nome
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="block w-full text-lg font-bold text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="Seu nome"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-1 block">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="block w-full text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-300">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                  {user.name || "Usuário"}
                </h2>
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-2 font-medium">
                  <Phone size={16} className="text-primary-500" />
                  <span>{user.phone || "Sem telefone"}</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isLoading}
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all shadow-sm ${
              isEditing
                ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-green-200 dark:hover:shadow-none"
                : "bg-gray-100 text-gray-500 hover:bg-primary-50 hover:text-primary-600 dark:bg-gray-700 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-primary-400"
            }`}
            aria-label={isEditing ? "Salvar" : "Editar"}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : isEditing ? (
              <Check size={20} />
            ) : (
              <Edit2 size={18} />
            )}
          </button>
        </div>

        {isEditing && (
          <button
            onClick={() => setIsEditing(false)}
            className="w-full mt-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-2 transition-colors bg-gray-50 dark:bg-gray-800/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={14} /> Cancelar
          </button>
        )}
      </div>
    </div>
  );
}
