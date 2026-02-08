import type { Metadata } from "next";
import { Inter } from "next/font/google";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "@/components/ui/sonner";
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
  title: "Imóveis no Litoral Norte | Venda e Locação",
  description:
    "Anuncie ou encontre imóveis para venda e locação no Litoral Norte. Casas e apartamentos em Caraguatatuba, Ubatuba, Ilhabela e São Sebastião.",
  keywords: [
    "imóveis litoral norte",
    "casas caraguatatuba",
    "apartamentos ubatuba",
    "imóveis ilhabela",
    "aluguel são sebastião",
    "venda imóveis praia",
    "litoral norte sp",
  ],
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
    apple: "/icon-192.png",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LN Imóveis",
  },
  formatDetection: {
    telephone: true,
  },
  openGraph: {
    title: "LN Imóveis - Imóveis no Litoral Norte de São Paulo",
    description:
      "Plataforma para anunciar e encontrar imóveis para venda e locação no Litoral Norte de São Paulo.",
    type: "website",
    url: "https://imoveis-caragua.vercel.app",
    siteName: "LN Imóveis",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "LN Imóveis - Imóveis no Litoral Norte",
    description:
      "Encontre casas e apartamentos em Caraguatatuba, Ubatuba, Ilhabela e São Sebastião.",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://imoveis-caragua.vercel.app",
  },
  other: {
    "mobile-web-app-capable": "yes",
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
        <meta name="theme-color" content="#3b82f6" />
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
        <Toaster />
        <WhatsAppButton />
      </body>
    </html>
  );
}
