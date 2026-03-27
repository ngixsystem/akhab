"use client";

import Link from "next/link";
import { ArrowRight, Boxes, CheckCircle2, Layers3, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BASE_PATH } from "@/lib/constants";
import { assetPath, cn, formatCurrency, formatProductType } from "@/lib/utils";
import { useCart } from "./cart-provider";

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    title: string;
    description: string;
    productType: "REBAR" | "PROFILE";
    photos: string[];
    size?: string | null;
    length?: string | null;
    pricePerPiece?: number | string | { toString(): string } | null;
    pricePerTon?: number | string | { toString(): string } | null;
    inventory: {
      available: number;
    } | null;
  };
};

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const price =
    product.productType === "REBAR"
      ? Number(product.pricePerPiece ?? product.pricePerTon ?? 0)
      : undefined;

  return (
    <article className="group card overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-slate-500/30">
      <div className="relative h-64 overflow-hidden border-b border-border bg-slate-950">
        <img
          src={assetPath(product.photos[0])}
          alt={product.title}
          className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-100">{formatProductType(product.productType)}</Badge>
          <Badge className={cn(
            "border-0",
            (product.inventory?.available ?? 0) > 0 ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-700 text-slate-200"
          )}>
            {(product.inventory?.available ?? 0) > 0 ? "в наличии" : "под заказ"}
          </Badge>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-3xl leading-none text-white">{product.title}</h3>
        </div>
      </div>

      <div className="space-y-5 p-5 text-white sm:p-6">
        <p className="line-clamp-3 text-sm leading-6 text-slate-400">{product.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-sm border border-border bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <Boxes className="h-4 w-4" /> Остаток
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{product.inventory?.available ?? 0}</div>
          </div>
          <div className="rounded-sm border border-border bg-white/5 p-4">
            <div className="flex items-center gap-2 text-slate-500">
              <CheckCircle2 className="h-4 w-4" /> Цена
            </div>
            <div className="mt-2 text-lg font-semibold text-white">{formatCurrency(price)}</div>
          </div>
        </div>

        {(product.size || product.length) && (
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
            {product.size ? (
              <span className="inline-flex items-center gap-2 rounded-sm border border-border px-3 py-2">
                <Layers3 className="h-3.5 w-3.5" /> {product.size}
              </span>
            ) : null}
            {product.length ? <span className="rounded-sm border border-border px-3 py-2">{product.length}</span> : null}
          </div>
        )}

        <div className="flex gap-3">
          <Link href={`${BASE_PATH}/product/${product.slug}`} className="btn-secondary flex-1 justify-center gap-2 text-center">
            Подробнее <ArrowRight className="h-4 w-4" />
          </Link>
          <Button
            variant="accent"
            className="flex-1 gap-2"
            onClick={() =>
              addItem({
                productId: product.id,
                title: product.title,
                slug: product.slug,
                quantity: 1,
                price,
                photo: product.photos[0],
                productType: formatProductType(product.productType)
              })
            }
          >
            <ShoppingCart className="h-4 w-4" /> В корзину
          </Button>
        </div>
      </div>
    </article>
  );
}
