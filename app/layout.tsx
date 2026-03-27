import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/storefront/cart-provider";

export const metadata: Metadata = {
  title: "Planner",
  description: "Industrial B2B metal products storefront and admin panel."
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
