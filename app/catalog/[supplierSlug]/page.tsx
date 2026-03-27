import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { Badge } from "@/components/ui/badge";
import { CatalogClient } from "@/components/storefront/catalog-client";
import { SupplierChooser } from "@/components/storefront/supplier-chooser";
import { getPublicProducts, getPublicSuppliers, getStoreSettings, getSupplierBySlug } from "@/lib/data";
import { BASE_PATH } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function SupplierCatalogPage({
  params
}: Readonly<{
  params: Promise<{ supplierSlug: string }>;
}>) {
  const { supplierSlug } = await params;
  const [settings, suppliers, supplier, products] = await Promise.all([
    getStoreSettings(),
    getPublicSuppliers(),
    getSupplierBySlug(supplierSlug),
    getPublicProducts(supplierSlug)
  ]);

  if (!supplier || !supplier.isActive) notFound();

  const availableCount = products.filter((product) => (product.inventory?.available ?? 0) > 0).length;

  return (
    <div>
      <SiteHeader />
      <main className="container-shell py-14 lg:py-16">
        <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-100">Каталог поставщика</Badge>
        <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-6xl leading-none text-white sm:text-7xl">{supplier.name}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
              {supplier.description || "Выберите нужные позиции из ассортимента этого поставщика и переходите в карточку товара или сразу в корзину."}
            </p>
          </div>
          <Link href={`${BASE_PATH}/catalog`} className="btn-secondary">
            Все поставщики
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-sm border border-border bg-white/5 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Товаров</div>
            <div className="mt-2 text-3xl font-semibold">{products.length}</div>
          </div>
          <div className="rounded-sm border border-border bg-white/5 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">В наличии</div>
            <div className="mt-2 text-3xl font-semibold">{availableCount}</div>
          </div>
          <div className="rounded-sm border border-border bg-white/5 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Фильтр по query</div>
            <div className="mt-2 text-lg font-semibold">?supplier={supplier.slug}</div>
          </div>
        </div>

        <SupplierChooser suppliers={suppliers} selectedSupplierSlug={supplier.slug} />
        <CatalogClient products={products} supplierName={supplier.name} supplierSlug={supplier.slug} />
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
