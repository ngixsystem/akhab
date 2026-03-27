import Link from "next/link";
import { ArrowRight, Building2, PackageCheck, Shield, Warehouse } from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { Badge } from "@/components/ui/badge";
import { getPublicProducts, getStoreSettings } from "@/lib/data";
import { BASE_PATH } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, products] = await Promise.all([getStoreSettings(), getPublicProducts()]);
  const featured = products.slice(0, 3);
  const availableCount = products.filter((product) => (product.inventory?.available ?? 0) > 0).length;
  const rebarCount = products.filter((product) => product.productType === "REBAR").length;

  return (
    <div>
      <SiteHeader />
      <main>
        <section className="overflow-hidden">
          <div className="container-shell grid gap-10 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
            <div>
              <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-100">Industrial storefront</Badge>
              <h1 className="mt-6 max-w-4xl text-6xl leading-[0.9] text-white sm:text-7xl lg:text-8xl">
                {settings?.heroTitle || "METIS — металлопрокат для стройки и производства"}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                {settings?.heroSubtitle || "Актуальные позиции, складские остатки и быстрые заявки без разрыва с существующим бэкендом."}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href={`${BASE_PATH}/catalog`} className="btn-accent">
                  Перейти в каталог
                </Link>
                <Link href={`${BASE_PATH}/checkout`} className="btn-secondary">
                  Оставить заявку
                </Link>
              </div>
            </div>

            <div className="card steel-outline p-6 text-white sm:p-8">
              <div className="grid gap-4">
                <div className="rounded-sm border border-border bg-white/5 p-5">
                  <div className="text-sm uppercase tracking-[0.2em] text-slate-500">Основные категории</div>
                  <div className="mt-3 text-4xl text-white">Арматура и профиль</div>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    { icon: PackageCheck, label: "Актуальные остатки", value: `${availableCount}+` },
                    { icon: Warehouse, label: "Позиции в каталоге", value: `${products.length}` },
                    { icon: Building2, label: "Арматура", value: `${rebarCount}` }
                  ].map((item) => (
                    <div key={item.label} className="rounded-sm border border-border bg-white/5 p-5">
                      <item.icon className="h-6 w-6 text-blue-400" />
                      <div className="mt-4 text-3xl text-white">{item.value}</div>
                      <div className="mt-1 text-sm text-slate-400">{item.label}</div>
                    </div>
                  ))}
                </div>
                <div className="rounded-sm border border-blue-500/20 bg-blue-500/10 p-5">
                  <div className="flex items-start gap-3">
                    <Shield className="mt-0.5 h-5 w-5 text-blue-300" />
                    <p className="text-sm leading-7 text-slate-200">
                      METIS использует текущие данные приложения: те же товары, остатки и оформление заявки, без изменения админ-панели и API.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="mb-8 flex items-end justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Каталог</p>
              <h2 className="mt-3 text-5xl leading-none text-white">Актуальные позиции с живыми остатками</h2>
            </div>
            <Link
              href={`${BASE_PATH}/catalog`}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-200"
            >
              Смотреть все <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="container-shell pb-16">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="card bg-gradient-steel p-8 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-blue-100/80">Контакты</p>
              <h3 className="mt-3 text-5xl leading-none">Работаем быстро и прозрачно</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50/85">{settings?.aboutText}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-blue-50/90">
                <span className="rounded-sm border border-white/20 px-3 py-2">{settings?.companyName || "METIS"}</span>
                <span className="rounded-sm border border-white/20 px-3 py-2">{settings?.phone || "Телефон не указан"}</span>
                <span className="rounded-sm border border-white/20 px-3 py-2">{settings?.telegram || "Telegram не указан"}</span>
              </div>
            </div>
            <div className="card p-8 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Заявка</p>
              <h3 className="mt-3 text-5xl leading-none">Нужен расчёт по позиции?</h3>
              <p className="mt-4 text-sm leading-7 text-slate-400">
                Передайте заказ через текущую форму оформления. Менеджер увидит его в существующей админке без дополнительной интеграции.
              </p>
              <Link href={`${BASE_PATH}/checkout`} className="btn-primary mt-8">
                Оформить заказ
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
