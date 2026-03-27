import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { getStoreSettings } from "@/lib/data";
import { BASE_PATH } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const settings = await getStoreSettings();

  return (
    <div>
      <SiteHeader />
      <main>
        <section className="relative min-h-[calc(100vh-64px)] overflow-hidden lg:min-h-[calc(100vh-80px)]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-assets/metis-hero.jpg')" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,11,18,0.92)_0%,rgba(7,11,18,0.82)_34%,rgba(7,11,18,0.58)_62%,rgba(7,11,18,0.42)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,11,18,0.35)_0%,rgba(7,11,18,0.68)_100%)]" />

          <div className="relative container-shell flex min-h-[calc(100vh-64px)] items-center py-16 lg:min-h-[calc(100vh-80px)] lg:py-20">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 text-sm font-medium uppercase tracking-[0.28em] text-blue-400">
                <div className="h-px w-10 bg-blue-500" />
                Металлопрокат с доставкой
              </div>

              <h1 className="mt-6 text-5xl leading-[0.88] text-white sm:text-6xl lg:text-[6.5rem]">
                АРМАТУРА
                <br />
                <span className="text-blue-500">ВЫСШЕГО</span>
                <br />
                КАЧЕСТВА
              </h1>

              <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Поставляем арматуру, металлопрокат и профиль напрямую от поставщиков. Актуальные остатки, понятная витрина и быстрые заявки.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                <Link href={`${BASE_PATH}/catalog`} className="btn-accent gap-3 px-6 sm:px-8">
                  Каталог продукции <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href={`${BASE_PATH}/checkout`} className="btn-secondary px-6 sm:px-8">
                  Получить расчёт
                </Link>
              </div>

              <div className="mt-10 grid max-w-md grid-cols-3 gap-4 border-t border-white/10 pt-6 sm:mt-14 sm:gap-8 sm:pt-8">
                {[
                  { value: "15+", label: "лет на рынке" },
                  { value: "500+", label: "партнёров" },
                  { value: "24ч", label: "доставка" }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="text-3xl leading-none text-white sm:text-4xl">{item.value}</div>
                    <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-slate-400 sm:text-xs">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
