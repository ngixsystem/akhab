import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Boxes, CheckCircle2, MessageCircle, Phone, Ruler, Scale, Shapes, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

  const heroPhoto = product.photos.at(-1) || product.photos[0];
  const price =
    product.productType === "REBAR"
      ? Number(product.pricePerPiece ?? product.pricePerTon ?? 0)
      : undefined;

  return (
    <div>
      <SiteHeader />
      <main className="container-shell py-14 lg:py-16">
        <div className="mb-8">
          <Link
            href={`${BASE_PATH}/catalog`}
            className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Назад в каталог
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="space-y-3">
            <div className="card overflow-hidden">
              <img src={assetPath(heroPhoto)} alt={product.title} className="h-[420px] w-full object-cover" />
            </div>
            {product.photos.length > 1 ? (
              <div className="grid grid-cols-4 gap-3">
                {product.photos.map((photo, index) => (
                  <div key={`${photo}-${index}`} className="overflow-hidden rounded-sm border border-border bg-slate-950/50">
                    <img src={assetPath(photo)} alt={`${product.title} ${index + 1}`} className="aspect-square w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-100">{formatProductType(product.productType)}</Badge>
              <Badge className={(product.inventory?.available ?? 0) > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700 text-slate-200"}>
                {(product.inventory?.available ?? 0) > 0 ? "В наличии" : "Под заказ"}
              </Badge>
            </div>

            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-500">{product.companyName}</div>
              <h1 className="mt-3 text-6xl leading-none text-white">{product.title}</h1>
              <p className="mt-5 text-base leading-8 text-slate-400">{product.description}</p>
            </div>

            <div className="card grid gap-4 p-5 sm:grid-cols-2 sm:p-6">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Цена</div>
                <div className="mt-2 text-4xl leading-none text-white">{formatCurrency(price)}</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-slate-500">Доступно</div>
                <div className="mt-2 text-4xl leading-none text-white">{product.inventory?.available ?? 0}</div>
              </div>
            </div>

            <div className="card space-y-0 p-5 sm:p-6">
              {product.productType === "REBAR" ? (
                <>
                  <SpecRow icon={Shapes} label="Тип товара" value={formatProductType(product.productType)} />
                  <SpecRow icon={Ruler} label="Размер" value={product.size} />
                  <SpecRow icon={Ruler} label="Длина" value={product.length} />
                  <SpecRow icon={Scale} label="Метр / тонна" value={product.meterPerTon?.toString()} />
                  <SpecRow icon={Boxes} label="Штук / тонна" value={product.piecesPerTon?.toString()} />
                  <SpecRow icon={CheckCircle2} label="Цена / тонна" value={formatCurrency(product.pricePerTon?.toString())} />
                </>
              ) : (
                product.attributes.map((attribute) => (
                  <SpecRow key={attribute.id} icon={Shapes} label={attribute.key} value={attribute.value} />
                ))
              )}
            </div>

            <div className="card p-5 sm:p-6">
              <h2 className="text-3xl leading-none text-white">Контакты</h2>
              <div className="mt-4 space-y-3 text-sm text-slate-300">
                <a href={`tel:${product.phone}`} className="flex items-center gap-3 transition hover:text-white">
                  <Phone className="h-4 w-4 text-blue-400" />
                  <span>{product.phone}</span>
                </a>
                <div className="flex items-center gap-3 text-slate-400">
                  <MessageCircle className="h-4 w-4 text-blue-400" />
                  <span>{product.telegram || settings?.telegram || "Telegram не указан"}</span>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <AddToCartButton
                  item={{
                    productId: product.id,
                    title: product.title,
                    slug: product.slug,
                    quantity: 1,
                    price,
                    photo: heroPhoto,
                    productType: formatProductType(product.productType)
                  }}
                />
                <Link href={`${BASE_PATH}/checkout`}>
                  <Button variant="secondary" className="gap-2">
                    <ShoppingCart className="h-4 w-4" /> Оформить заказ
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}

function SpecRow({
  icon: Icon,
  label,
  value
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value?: string | null;
}>) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-none last:pb-0">
      <span className="flex items-center gap-3 text-sm text-slate-400">
        <Icon className="h-4 w-4 text-blue-400" />
        {label}
      </span>
      <span className="text-sm font-medium text-white">{value || "Не указано"}</span>
    </div>
  );
}
