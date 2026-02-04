'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, Heart, Home, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import LoginModal from './LoginModal';

export default function UserMenu() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fechar menu ao clicar fora
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return (
      <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
    );
  }

  if (!session) {
    return (
      <>
        <button
          onClick={() => setLoginOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white text-sm font-medium rounded-xl hover:bg-primary-600 transition-colors"
        >
          <User size={16} />
          Entrar
        </button>
        <LoginModal isOpen={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    );
  }

  const userName = session.user.name || 'Usuario';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-gray-100 transition-colors"
      >
        {session.user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={session.user.image}
            alt={userName}
            className="w-8 h-8 rounded-full object-cover"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
            {userInitial}
          </div>
        )}
        <ChevronDown
          size={16}
          className={`text-gray-500 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          {/* User info */}
          <div className="px-4 py-2 border-b border-gray-100">
            <p className="font-medium text-gray-900 text-sm">{userName}</p>
            <p className="text-xs text-gray-500">
              {(session.user as { phone?: string }).phone || ''}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <Link
              href="/meus-imoveis"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Home size={16} className="text-gray-400" />
              Meus imoveis
            </Link>
            <Link
              href="/favoritos"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Heart size={16} className="text-gray-400" />
              Favoritos
            </Link>
            <Link
              href="/perfil"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User size={16} className="text-gray-400" />
              Meu perfil
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
