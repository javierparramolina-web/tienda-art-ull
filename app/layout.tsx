import type { Metadata } from "next";
// import localFont from "next/font/local"; // Removing localFont for now if not used or stick to standard
// import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import Header from "@/components/Header";
import { Footer } from "@/components/Footer";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Art-ULL | Tienda de Ilustraciones",
  description: "Ilustraciones originales y prints de Art-ULL",
};

import CartSheet from "@/components/cart/CartSheet";
import ClientProvider from "@/components/ClientProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`antialiased min-h-screen flex flex-col bg-white text-gray-900 font-sans`}
      >
        <ClientProvider>
          <CartSheet />
          <Header />
          <main className="flex-1 pt-20">
            {children}
          </main>
          <Footer />
        </ClientProvider>
      </body>
    </html>
  );
}
