import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/storefront/cart-provider";

export const metadata: Metadata = {
  title: "OOO METIKS",
  description: "OOO METIKS — арматура высшего качества."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
