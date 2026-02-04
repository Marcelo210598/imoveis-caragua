'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Plus } from 'lucide-react';
import UserMenu from '@/components/auth/UserMenu';
import ThemeToggle from '@/components/ThemeToggle';

const navLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/imoveis', label: 'Imoveis' },
  { href: '/deals', label: 'Oportunidades' },
  { href: '/favoritos', label: 'Favoritos' },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary-600 dark:text-primary-400">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.svg" alt="Logo" className="w-8 h-8 rounded-lg" />
            <span className="hidden sm:inline">Litoral Norte Imoveis</span>
            <span className="sm:hidden">LN Imoveis</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Anunciar + Theme + User menu + mobile toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/imoveis/novo"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} />
              Anunciar
            </Link>
            <ThemeToggle />
            <UserMenu />
            <button
              className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/imoveis/novo"
              className="block py-2 text-primary-600 dark:text-primary-400 font-medium"
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
