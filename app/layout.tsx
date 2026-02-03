import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Litoral Norte Imoveis - Encontre seu imovel de praia',
  description:
    'Encontre casas e apartamentos no Litoral Norte de SP: Caraguatatuba, Ubatuba, Ilhabela e Sao Sebastiao. Precos atualizados de ZAP e VivaReal.',
  openGraph: {
    title: 'Litoral Norte Imoveis',
    description:
      'Os melhores imoveis no Litoral Norte de Sao Paulo',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`}>
        <Header />
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
