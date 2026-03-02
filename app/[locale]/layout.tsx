import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Locale, locales, defaultLocale } from '@/lib/i18n'
import { CartProvider } from '@/context/CartContext'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bar Menu",
  description: "Professional Bar Menu & Management System",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params
  return (
    <html lang={locale || defaultLocale} className="dark">
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
