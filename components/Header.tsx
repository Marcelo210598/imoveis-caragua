'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';
import UserMenu from '@/components/auth/UserMenu';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/imoveis', label: 'Imoveis' },
  { href: '/deals', label: 'Oportunidades' },
  { href: '/favoritos', label: 'Favoritos' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600">
            <span className="text-2xl">🏖️</span>
            <span className="hidden sm:inline">Litoral Norte Imoveis</span>
            <span className="sm:hidden">LN Imoveis</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 hover:text-primary-600 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Anunciar + User menu + mobile toggle */}
          <div className="flex items-center gap-3">
            <Link
              href="/imoveis/novo"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} />
              Anunciar
            </Link>
            <UserMenu />
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-600 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/imoveis/novo"
              className="block py-2 text-primary-600 font-medium"
              onClick={() => setMenuOpen(false)}
            >
              + Anunciar imovel
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
