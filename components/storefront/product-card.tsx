"use client";

import Link from "next/link";
import { ArrowRight, Boxes, CircleDollarSign, Layers3, ShoppingCart } from "lucide-react";
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
  const heroPhoto = product.photos[0] || product.photos.at(-1);
  const price =
    product.productType === "REBAR"
      ? Number(product.pricePerPiece ?? product.pricePerTon ?? 0)
      : undefined;

  return (
    <article className="group overflow-hidden rounded-sm border border-[#273246] bg-[#121a29] shadow-[0_12px_32px_rgba(0,0,0,0.25)] transition duration-300 hover:-translate-y-1 hover:border-[#36507d]">
      <div className="relative h-[220px] overflow-hidden border-b border-[#273246] bg-[#0d1320] sm:h-[240px]">
        <img
          src={assetPath(heroPhoto)}
          alt={product.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,14,0.12)_0%,rgba(5,8,14,0.24)_45%,rgba(5,8,14,0.84)_100%)]" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge className="rounded-full border border-blue-500/20 bg-[#243753] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-blue-100">
            {formatProductType(product.productType)}
          </Badge>
          <Badge
            className={cn(
              "rounded-full border-0 px-3 py-1 text-[11px] uppercase tracking-[0.18em]",
              (product.inventory?.available ?? 0) > 0 ? "bg-[#1d4f38] text-[#b5f2ce]" : "bg-slate-700 text-slate-200"
            )}
          >
            {(product.inventory?.available ?? 0) > 0 ? "В наличии" : "Под заказ"}
          </Badge>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <h3 className="text-3xl leading-[0.92] text-white sm:text-[2.1rem]">{product.title}</h3>
        </div>
      </div>

      <div className="space-y-4 p-4 text-white sm:space-y-5 sm:p-5">
        <p className="min-h-[72px] text-sm leading-7 text-slate-300">{product.description}</p>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-sm border border-[#31405a] bg-[#1a2333] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
              <Boxes className="h-3.5 w-3.5" /> Остаток
            </div>
            <div className="mt-3 text-[1.7rem] font-semibold leading-none text-white">{product.inventory?.available ?? 0}</div>
          </div>
          <div className="rounded-sm border border-[#31405a] bg-[#1a2333] p-4">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
              <CircleDollarSign className="h-3.5 w-3.5" /> Цена
            </div>
            <div className="mt-3 text-xl font-semibold leading-none text-white">{formatCurrency(price)}</div>
          </div>
        </div>

        {(product.size || product.length) && (
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-slate-300">
            {product.size ? (
              <span className="inline-flex items-center gap-2 rounded-sm border border-[#31405a] bg-[#141d2b] px-3 py-2">
                <Layers3 className="h-3.5 w-3.5 text-slate-400" /> {product.size}
              </span>
            ) : null}
            {product.length ? (
              <span className="rounded-sm border border-[#31405a] bg-[#141d2b] px-3 py-2">{product.length}</span>
            ) : null}
          </div>
        )}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Link
            href={`${BASE_PATH}/product/${product.slug}`}
            className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#31405a] bg-transparent px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-white/5"
          >
            Подробнее <ArrowRight className="h-4 w-4" />
          </Link>
          <Button
            variant="accent"
            className="w-full justify-center gap-2 rounded-sm bg-[#3b82f6] px-4 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#4d8ef8]"
            onClick={() =>
              addItem({
                productId: product.id,
                title: product.title,
                slug: product.slug,
                quantity: 1,
                price,
                photo: heroPhoto,
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
