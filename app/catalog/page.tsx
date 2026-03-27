import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { Badge } from "@/components/ui/badge";
import { CatalogClient } from "@/components/storefront/catalog-client";
import { getPublicProducts, getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const [settings, products] = await Promise.all([getStoreSettings(), getPublicProducts()]);
  const availableCount = products.filter((product) => (product.inventory?.available ?? 0) > 0).length;

  return (
    <div>
      <SiteHeader />
      <main className="container-shell py-14 lg:py-16">
        <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-100">Каталог</Badge>
        <h1 className="mt-5 text-6xl leading-none text-white sm:text-7xl">Арматура и профиль</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
          Подбор по живому каталогу OOO METIKS: ищите позиции по названию и параметрам, смотрите наличие и переходите в карточку товара без моков и дублирования данных.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-sm border border-border bg-white/5 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Всего позиций</div>
            <div className="mt-2 text-3xl font-semibold">{products.length}</div>
          </div>
          <div className="rounded-sm border border-border bg-white/5 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">В наличии</div>
            <div className="mt-2 text-3xl font-semibold">{availableCount}</div>
          </div>
          <div className="rounded-sm border border-border bg-white/5 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Компания</div>
            <div className="mt-2 text-lg font-semibold">{settings?.companyName || "OOO METIKS"}</div>
          </div>
        </div>
        <CatalogClient products={products} />
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
