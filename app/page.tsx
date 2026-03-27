import Link from "next/link";
import { ArrowRight, Building2, PackageCheck, Shield } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { Badge } from "@/components/ui/badge";
import { getPublicProducts, getStoreSettings } from "@/lib/data";
import { BASE_PATH } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, products] = await Promise.all([getStoreSettings(), getPublicProducts()]);

  return (
    <div>
      <SiteHeader />
      <main>
        <section className="overflow-hidden bg-slate-950 text-white">
          <div className="container-shell grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:py-24">
            <div>
              <Badge className="border-amber-500/20 bg-amber-500/10 text-amber-300">
                Industrial supply
              </Badge>
              <h1 className="mt-6 max-w-3xl text-5xl font-semibold leading-tight sm:text-6xl">
                {settings?.heroTitle || "Металлопрокат для стройки и производства"}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {settings?.heroSubtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={`${BASE_PATH}/catalog`} className="btn-accent">
                  Перейти в каталог
                </Link>
                <Link href={`${BASE_PATH}/contacts`} className="btn-secondary border-white/10 bg-white/10 text-white hover:bg-white/20">
                  Связаться с нами
                </Link>
              </div>
            </div>
            <div className="card border-white/10 bg-white/5 p-6 text-white">
              <div className="grid gap-4">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="text-sm text-slate-400">Основные категории</div>
                  <div className="mt-3 text-2xl font-semibold">Арматура и профиль</div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: PackageCheck, label: "Учет остатков" },
                    { icon: Shield, label: "Контроль заказов" },
                    { icon: Building2, label: "B2B подача" }
                  ].map((item) => (
                    <div key={item.label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                      <item.icon className="h-6 w-6 text-amber-300" />
                      <div className="mt-4 text-sm font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Каталог</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">
                Актуальные позиции с остатками
              </h2>
            </div>
            <Link
              href={`${BASE_PATH}/catalog`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
            >
              Смотреть все <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {products.slice(0, 3).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="container-shell pb-16">
          <div className="card grid gap-8 overflow-hidden bg-gradient-to-br from-amber-500 to-orange-400 p-8 text-slate-950 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-800/70">Контакты</p>
              <h3 className="mt-3 text-3xl font-semibold">Работаем быстро и прозрачно</h3>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-900/75">
                {settings?.aboutText}
              </p>
            </div>
            <Link href={`${BASE_PATH}/checkout`} className="btn-primary bg-slate-950 text-white hover:bg-slate-900">
              Оставить заявку
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
