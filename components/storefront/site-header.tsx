"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, ShieldCheck } from "lucide-react";
import { BASE_PATH } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useCart } from "./cart-provider";

const links = [
  { href: `${BASE_PATH}`, label: "Главная" },
  { href: `${BASE_PATH}/catalog`, label: "Каталог" },
  { href: `${BASE_PATH}/contacts`, label: "Контакты" },
  { href: `${BASE_PATH}/checkout`, label: "Оформление" }
];

export function SiteHeader() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-slate-950/90 text-white backdrop-blur">
      <div className="container-shell flex items-center justify-between gap-6 py-4">
        <Link href={`${BASE_PATH}`} className="flex items-center gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/10 px-3 py-2 text-xs font-bold tracking-[0.3em] text-amber-300">
            PLNR
          </div>
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-200">
              planner
            </div>
            <div className="text-xs text-slate-400">metal products store</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white",
                pathname === link.href && "bg-white/10 text-white"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href={`${BASE_PATH}/checkout`}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white transition hover:bg-white/20"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>{totalItems}</span>
          </Link>
          <Link
            href={`${BASE_PATH}/admin/login`}
            className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-200 transition hover:bg-amber-500/20"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Admin</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
