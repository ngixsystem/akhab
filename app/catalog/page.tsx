import { ProductCard } from "@/components/storefront/product-card";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { Badge } from "@/components/ui/badge";
import { getPublicProducts, getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CatalogPage() {
  const [settings, products] = await Promise.all([getStoreSettings(), getPublicProducts()]);

  return (
    <div>
      <SiteHeader />
      <main className="container-shell py-14">
        <Badge>Каталог</Badge>
        <h1 className="mt-5 text-4xl font-semibold text-slate-950">Арматура и профиль</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          Выбирайте продукцию по типу, смотрите наличие и оформляйте заказ напрямую через витрину.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
