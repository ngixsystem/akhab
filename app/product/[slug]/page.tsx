import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { AddToCartButton } from "@/components/storefront/add-to-cart-button";
import { getProductBySlug, getStoreSettings } from "@/lib/data";
import { assetPath, formatCurrency, formatProductType } from "@/lib/utils";
import { BASE_PATH } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({
  params
}: Readonly<{
  params: Promise<{ slug: string }>;
}>) {
  const { slug } = await params;
  const [settings, product] = await Promise.all([getStoreSettings(), getProductBySlug(slug)]);
  if (!product || !product.isActive) notFound();

  const price =
    product.productType === "REBAR"
      ? Number(product.pricePerPiece ?? product.pricePerTon ?? 0)
      : undefined;

  return (
    <div>
      <SiteHeader />
      <main className="container-shell py-14">
        <div className="mb-6">
          <Link href={`${BASE_PATH}/catalog`} className="text-sm font-medium text-slate-500">
            Назад в каталог
          </Link>
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="card overflow-hidden">
            <img src={assetPath(product.photos[0])} alt={product.title} className="h-[420px] w-full object-cover" />
          </div>
          <div className="card p-8">
            <Badge>{formatProductType(product.productType)}</Badge>
            <h1 className="mt-5 text-4xl font-semibold text-slate-950">{product.title}</h1>
            <p className="mt-5 text-base leading-8 text-slate-600">{product.description}</p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Цена</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {formatCurrency(price)}
                </div>
              </div>
              <div className="rounded-3xl bg-slate-50 p-5">
                <div className="text-sm text-slate-500">Доступно</div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {product.inventory?.available ?? 0}
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-3 rounded-3xl border border-slate-100 bg-slate-50 p-5">
              {product.productType === "REBAR" ? (
                <>
                  <SpecRow label="Размер" value={product.size} />
                  <SpecRow label="Длина" value={product.length} />
                  <SpecRow label="Метр/тонна" value={product.meterPerTon?.toString()} />
                  <SpecRow label="Штук/тонна" value={product.piecesPerTon?.toString()} />
                  <SpecRow label="Цена/тонна" value={formatCurrency(product.pricePerTon?.toString())} />
                </>
              ) : (
                product.attributes.map((attribute) => (
                  <SpecRow key={attribute.id} label={attribute.key} value={attribute.value} />
                ))
              )}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <AddToCartButton
                item={{
                  productId: product.id,
                  title: product.title,
                  slug: product.slug,
                  quantity: 1,
                  price,
                  photo: product.photos[0],
                  productType: formatProductType(product.productType)
                }}
              />
              <Link href={`${BASE_PATH}/checkout`}>
                <Button variant="secondary">Оформить заказ</Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

function SpecRow({ label, value }: Readonly<{ label: string; value?: string | null }>) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-slate-200 pb-3 last:border-none last:pb-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-medium text-slate-900">{value || "Не указано"}</span>
    </div>
  );
}
