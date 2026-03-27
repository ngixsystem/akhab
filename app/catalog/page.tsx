import { redirect } from "next/navigation";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { Badge } from "@/components/ui/badge";
import { SupplierChooser } from "@/components/storefront/supplier-chooser";
import { getPublicSuppliers, getStoreSettings } from "@/lib/data";
import { BASE_PATH } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<{ supplier?: string }>;
}>) {
  const resolvedSearchParams = (await searchParams) || {};
  const supplierSlug = resolvedSearchParams.supplier;

  if (supplierSlug) {
    redirect(`${BASE_PATH}/catalog/${supplierSlug}`);
  }

  const [settings, suppliers] = await Promise.all([getStoreSettings(), getPublicSuppliers()]);

  return (
    <div>
      <SiteHeader />
      <main className="container-shell py-14 lg:py-16">
        <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-100">Каталог</Badge>
        <h1 className="mt-5 text-6xl leading-none text-white sm:text-7xl">Сначала выберите поставщика</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-400">
          Разделили ассортимент по поставщикам: сначала выбираете партнера, затем видите только его актуальные позиции, остатки и цены.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-sm border border-border bg-white/5 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Поставщиков</div>
            <div className="mt-2 text-3xl font-semibold">{suppliers.length}</div>
          </div>
          <div className="rounded-sm border border-border bg-white/5 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Маршрут</div>
            <div className="mt-2 text-lg font-semibold">/catalog/[supplier]</div>
          </div>
          <div className="rounded-sm border border-border bg-white/5 p-4 text-white">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Компания</div>
            <div className="mt-2 text-lg font-semibold">{settings?.companyName || "OOO METIKS"}</div>
          </div>
        </div>
        <SupplierChooser suppliers={suppliers} />
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
