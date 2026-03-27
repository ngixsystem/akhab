import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  PackageCheck,
  Phone,
  Shield,
  Sparkles,
  Warehouse
} from "lucide-react";
import { ProductCard } from "@/components/storefront/product-card";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { Badge } from "@/components/ui/badge";
import { getPublicProducts, getStoreSettings } from "@/lib/data";
import { BASE_PATH } from "@/lib/constants";
import { formatProductType } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [settings, products] = await Promise.all([getStoreSettings(), getPublicProducts()]);
  const featured = products.slice(0, 3);
  const lead = products[0];
  const availableCount = products.filter((product) => (product.inventory?.available ?? 0) > 0).length;
  const totalStock = products.reduce((sum, product) => sum + (product.inventory?.available ?? 0), 0);
  const rebarCount = products.filter((product) => product.productType === "REBAR").length;

  return (
    <div>
      <SiteHeader />
      <main>
        <section className="overflow-hidden py-10 lg:py-16">
          <div className="container-shell grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-center">
            <div className="space-y-8">
              <div className="space-y-5">
                <Badge className="border-blue-500/20 bg-blue-500/10 px-4 py-2 text-blue-100">
                  <Sparkles className="mr-2 h-3.5 w-3.5" /> Industrial metal supply
                </Badge>
                <div className="max-w-5xl space-y-5">
                  <h1 className="max-w-4xl text-6xl leading-[0.88] text-white sm:text-7xl lg:text-8xl">
                    {settings?.heroTitle || "METIS — металлопрокат для стройки и производства"}
                  </h1>
                  <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                    {settings?.heroSubtitle ||
                      "Актуальные позиции, живые остатки и быстрые заявки — в одной витрине без хаоса и лишних согласований."}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link href={`${BASE_PATH}/catalog`} className="btn-accent gap-2 px-7">
                  Перейти в каталог <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={`${BASE_PATH}/checkout`} className="btn-secondary px-7">
                  Оставить заявку
                </Link>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Товаров в каталоге", value: `${products.length}`, note: "живые позиции" },
                  { label: "Доступно на складе", value: `${totalStock}+`, note: "единиц / штук" },
                  { label: "Арматура", value: `${rebarCount}`, note: "ключевая категория" }
                ].map((item) => (
                  <div key={item.label} className="rounded-sm border border-border bg-white/[0.03] p-5">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-500">{item.label}</div>
                    <div className="mt-3 text-4xl leading-none text-white">{item.value}</div>
                    <div className="mt-2 text-sm text-slate-400">{item.note}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-10 top-8 hidden h-40 w-40 rounded-full bg-blue-500/10 blur-3xl lg:block" />
              <div className="absolute -right-8 bottom-6 hidden h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl lg:block" />

              <div className="card steel-outline relative overflow-hidden p-6 text-white sm:p-8">
                <div className="absolute right-0 top-0 h-28 w-28 bg-blue-500/10 blur-2xl" />
                <div className="relative space-y-6">
                  <div className="rounded-sm border border-border bg-white/[0.04] p-6">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Ключевая позиция</div>
                    <div className="mt-3 text-4xl leading-none text-white">{lead?.title || "Арматура и профиль"}</div>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
                      {lead?.productType ? (
                        <span className="rounded-sm border border-border px-3 py-2">{formatProductType(lead.productType)}</span>
                      ) : null}
                      {lead?.size ? <span className="rounded-sm border border-border px-3 py-2">{lead.size}</span> : null}
                      {lead?.length ? <span className="rounded-sm border border-border px-3 py-2">{lead.length}</span> : null}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    {[
                      { icon: PackageCheck, label: "Актуальные остатки", value: `${availableCount}+` },
                      { icon: Warehouse, label: "Позиции", value: `${products.length}` },
                      { icon: Building2, label: "Категории", value: "2" }
                    ].map((item) => (
                      <div key={item.label} className="rounded-sm border border-border bg-white/[0.04] p-5">
                        <item.icon className="h-6 w-6 text-blue-400" />
                        <div className="mt-4 text-3xl leading-none text-white">{item.value}</div>
                        <div className="mt-2 text-sm text-slate-400">{item.label}</div>
                      </div>
                    ))}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-sm border border-blue-500/20 bg-blue-500/10 p-5">
                      <div className="flex items-start gap-3">
                        <Shield className="mt-0.5 h-5 w-5 text-blue-300" />
                        <p className="text-sm leading-7 text-slate-200">
                          METIS показывает реальные товары, остатки и ведёт заявку прямо в существующую админку.
                        </p>
                      </div>
                    </div>
                    <div className="rounded-sm border border-border bg-white/[0.04] p-5">
                      <div className="flex items-start gap-3">
                        <Phone className="mt-0.5 h-5 w-5 text-blue-300" />
                        <div>
                          <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Контакт</div>
                          <div className="mt-2 text-lg text-white">{settings?.phone || "+998 90 000 00 00"}</div>
                          <div className="mt-1 text-sm text-slate-400">{settings?.telegram || "Telegram не указан"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container-shell py-16">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-300">Избранные позиции</p>
              <h2 className="mt-3 text-5xl leading-none text-white">Ходовые товары с живыми остатками</h2>
            </div>
            <Link
              href={`${BASE_PATH}/catalog`}
              className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-slate-200"
            >
              Смотреть весь каталог <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        <section className="container-shell pb-16">
          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="card bg-gradient-steel p-8 text-white">
              <p className="text-sm uppercase tracking-[0.24em] text-blue-100/80">Почему METIS</p>
              <h3 className="mt-3 text-5xl leading-none">Работаем быстро и прозрачно</h3>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50/85">{settings?.aboutText}</p>
              <div className="mt-6 space-y-3 text-sm text-blue-50/90">
                {[
                  "Актуальные остатки без ручной сверки",
                  "Одна витрина для менеджера и клиента",
                  "Заявки сразу попадают в текущую админку"
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="card p-8 text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Компания</p>
                <h3 className="mt-3 text-5xl leading-none">{settings?.companyName || "METIS Metal Supply"}</h3>
                <div className="mt-6 space-y-3 text-sm text-slate-300">
                  <div>{settings?.phone || "Телефон не указан"}</div>
                  <div>{settings?.telegram || "Telegram не указан"}</div>
                  <div>{settings?.address || "Адрес не указан"}</div>
                </div>
              </div>
              <div className="card p-8 text-white">
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Заявка</p>
                <h3 className="mt-3 text-5xl leading-none">Нужен расчёт по позиции?</h3>
                <p className="mt-4 text-sm leading-7 text-slate-400">
                  Передай заявку через текущую форму — менеджер увидит её сразу в системе и обработает без лишней переписки.
                </p>
                <Link href={`${BASE_PATH}/checkout`} className="btn-primary mt-8">
                  Оформить заявку
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
