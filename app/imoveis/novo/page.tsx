'use client';

import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import PropertyForm from '@/components/property/PropertyForm';
import LoginModal from '@/components/auth/LoginModal';

export default function NovoImovelPage() {
  const { data: session, status } = useSession();
  const [loginOpen, setLoginOpen] = useState(false);

  if (status === 'loading') {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <Plus size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Anunciar imovel
            </h1>
            <p className="text-gray-500 mb-6">
              Faca login para publicar seu imovel gratuitamente.
            </p>
            <button
              onClick={() => setLoginOpen(true)}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors"
            >
              Entrar com telefone
            </button>
          </div>
        </div>
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Anunciar imovel</h1>
        <p className="text-gray-500 mt-2">
          Preencha os dados do seu imovel para publicar no site.
        </p>
      </div>
      <PropertyForm />
    </div>
  );
}
