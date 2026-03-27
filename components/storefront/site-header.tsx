"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Phone, ShieldCheck, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
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
  const router = useRouter();
  const { totalItems } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const homeHref = `${BASE_PATH}` || "/";

  function handleHomeClick(event?: React.MouseEvent) {
    if (pathname === homeHref || pathname === "/") {
      event?.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      setMenuOpen(false);
      router.refresh();
    }
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#0b1220]/95 text-white backdrop-blur-xl">
      <div className="container-shell flex min-h-16 items-center justify-between gap-3 py-3 lg:min-h-20 lg:gap-6">
        <Link href={homeHref} className="flex min-w-0 items-center gap-3" onClick={handleHomeClick}>
          <div className="h-8 w-1 rounded-full bg-gradient-steel lg:h-10" />
          <div className="min-w-0">
            <div className="truncate text-lg leading-none tracking-[0.14em] sm:text-xl lg:text-2xl">OOO METIKS</div>
            <div className="mt-1 hidden text-[10px] uppercase tracking-[0.24em] text-slate-400 sm:block sm:text-xs">
              АРМАТУРА ВЫСШЕГО КАЧЕСТВА
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={link.href === homeHref ? handleHomeClick : undefined}
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
            href="tel:+998900000000"
            className="hidden items-center gap-2 rounded-sm border border-border bg-white/5 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 xl:inline-flex"
          >
            <Phone className="h-4 w-4 text-blue-400" />
            <span>Позвонить</span>
          </a>

          <Link
            href={`${BASE_PATH}/checkout`}
            className="inline-flex items-center gap-2 rounded-sm border border-border bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="hidden sm:inline">Корзина</span>
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-blue-500 px-1.5 py-0.5 text-xs font-semibold text-white">
              {totalItems}
            </span>
          </Link>

          <Link
            href={`${BASE_PATH}/admin/login`}
            className="hidden items-center gap-2 rounded-sm border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-sm text-blue-100 transition hover:bg-blue-500/20 md:inline-flex"
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Admin</span>
          </Link>

          <button
            className="inline-flex items-center justify-center rounded-sm border border-border bg-white/5 p-2 text-slate-300 lg:hidden"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-border bg-[#0b1220] lg:hidden">
          <nav className="container-shell flex flex-col gap-3 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={link.href === homeHref ? handleHomeClick : undefined}
                className={cn(
                  "rounded-sm border border-transparent px-3 py-3 text-sm uppercase tracking-[0.2em] text-slate-300 transition hover:border-border hover:bg-white/5",
                  pathname === link.href && "border-border bg-white/5 text-white"
                )}
              >
                {link.label}
              </Link>
            ))}

            <a
              href="tel:+998900000000"
              className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-3 text-sm uppercase tracking-[0.18em] text-slate-200"
            >
              <Phone className="h-4 w-4 text-blue-400" />
              Позвонить
            </a>

            <Link
              href={`${BASE_PATH}/admin/login`}
              className="inline-flex items-center gap-2 rounded-sm border border-blue-500/30 bg-blue-500/10 px-3 py-3 text-sm uppercase tracking-[0.18em] text-blue-100"
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
