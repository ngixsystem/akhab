"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Phone, ShieldCheck, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { BASE_PATH } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCart } from "./cart-provider";

const links = [
  { href: `${BASE_PATH}`, label: "Главная" },
  { href: `${BASE_PATH}/catalog`, label: "Каталог" },
  { href: `${BASE_PATH}/contacts`, label: "Контакты" },
  { href: `${BASE_PATH}/checkout`, label: "Заявка" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#080d14]/85 text-white backdrop-blur-xl">
      <div className="container-shell flex h-16 items-center justify-between gap-6 lg:h-20">
        <Link href={`${BASE_PATH}`} className="flex min-w-0 items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-steel lg:h-10" />
          <div className="min-w-0">
            <div className="truncate text-2xl leading-none tracking-[0.18em] lg:text-3xl">METIS</div>
            <div className="mt-1 text-[10px] uppercase tracking-[0.34em] text-slate-400 sm:text-xs">
              steel supply storefront
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm uppercase tracking-[0.2em] text-slate-400 transition-colors hover:text-white",
                pathname === link.href && "text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="tel:+998903771111"
            className="hidden items-center gap-2 rounded-sm border border-border bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 lg:inline-flex"
          >
            <Phone className="h-4 w-4 text-blue-400" />
            <span>+998 90 377 11 11</span>
          </a>
          <Link
            href={`${BASE_PATH}/checkout`}
            className="inline-flex items-center gap-2 rounded-sm border border-border bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{totalItems}</span>
          </Link>
          <Link
            href={`${BASE_PATH}/admin/login`}
            className="hidden items-center gap-2 rounded-sm border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-100 transition hover:bg-blue-500/20 sm:inline-flex"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Admin</span>
          </Link>
          <button
            className="inline-flex items-center justify-center rounded-sm border border-border bg-white/5 p-2 text-slate-300 md:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-[#080d14] md:hidden">
          <nav className="container-shell flex flex-col gap-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm uppercase tracking-[0.2em] text-slate-300"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={`${BASE_PATH}/admin/login`}
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-blue-200"
              onClick={() => setMenuOpen(false)}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
