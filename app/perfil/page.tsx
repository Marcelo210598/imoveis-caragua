'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { User, Save, Loader2, Check } from 'lucide-react';
import LoginModal from '@/components/auth/LoginModal';

export default function PerfilPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (session?.user?.name) {
      setName(session.user.name);
    }
  }, [session]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // silencioso
    } finally {
      setSaving(false);
    }
  }

  if (status === 'loading') {
    return (
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-20 w-20 bg-gray-200 rounded-full mx-auto" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <>
        <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-20">
            <User size={64} className="mx-auto text-gray-300 mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Meu Perfil</h1>
            <p className="text-gray-500 mb-6">
              Faca login para editar seu perfil.
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
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          {session.user.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={session.user.image}
              alt="Avatar"
              className="w-20 h-20 rounded-full object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
              <User size={36} className="text-primary-600" />
            </div>
          )}
        </div>

        {/* Telefone (read-only) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Telefone
          </label>
          <input
            type="text"
            value={session.user.email || ''}
            disabled
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            O telefone nao pode ser alterado.
          </p>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome (visivel para interessados)"
            maxLength={100}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
          />
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 w-full bg-primary-600 text-white py-3 rounded-xl font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Salvando...
            </>
          ) : saved ? (
            <>
              <Check size={18} />
              Salvo!
            </>
          ) : (
            <>
              <Save size={18} />
              Salvar perfil
            </>
          )}
        </button>
      </div>
    </div>
  );
}
