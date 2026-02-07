import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/auth/AuthProvider";
import FavoritesProvider from "@/components/favorites/FavoritesProvider";
import ThemeProvider from "@/components/ThemeProvider";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Litoral Norte Imoveis - Encontre seu imovel de praia",
  description:
    "Encontre casas e apartamentos no Litoral Norte de SP: Caraguatatuba, Ubatuba, Ilhabela e Sao Sebastiao. Precos atualizados de ZAP e VivaReal.",
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Litoral Norte Imoveis",
    description: "Os melhores imoveis no Litoral Norte de Sao Paulo",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                var t = localStorage.getItem('theme');
                if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.className} bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 antialiased transition-colors`}
      >
        <AuthProvider>
          <ThemeProvider>
            <FavoritesProvider>
              <Header />
              <main className="min-h-[calc(100vh-4rem)]">{children}</main>
              <Footer />
            </FavoritesProvider>
          </ThemeProvider>
        </AuthProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
