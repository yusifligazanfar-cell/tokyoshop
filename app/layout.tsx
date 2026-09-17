import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

import { GeistSans } from 'geist/font/sans';

import { CartProvider } from "@/components/cart-context";

export const metadata: Metadata = {
  title: "TOKYO | 2026 Premium Fashion",
  description: "Built for everyday. The future of premium fashion e-commerce.",
};

import { CurrencyProvider } from "@/components/currency-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} font-medium antialiased min-h-screen flex flex-col bg-[var(--background)]`}
      >
        <CurrencyProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </CurrencyProvider>
      </body>
    </html>
  );
}
