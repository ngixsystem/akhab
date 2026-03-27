"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BASE_PATH } from "@/lib/constants";
import { assetPath, formatCurrency, formatProductType } from "@/lib/utils";
import { useCart } from "./cart-provider";

type ProductCardProps = {
  product: {
    id: string;
    slug: string;
    title: string;
    description: string;
    productType: "REBAR" | "PROFILE";
    photos: string[];
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
    <article className="card overflow-hidden">
      <div className="relative h-56 overflow-hidden">
        <img
          src={assetPath(product.photos[0])}
          alt={product.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-4 top-4">
          <Badge className="bg-white/90">{formatProductType(product.productType)}</Badge>
        </div>
      </div>
      <div className="space-y-5 p-6">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{product.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{product.description}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 rounded-3xl bg-slate-50 p-4 text-sm">
          <div>
            <div className="text-slate-500">Остаток</div>
            <div className="mt-1 font-semibold text-slate-900">
              {product.inventory?.available ?? 0}
            </div>
          </div>
          <div>
            <div className="text-slate-500">Цена</div>
            <div className="mt-1 font-semibold text-slate-900">{formatCurrency(price)}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href={`${BASE_PATH}/product/${product.slug}`} className="btn-secondary flex-1 text-center">
            Подробнее
          </Link>
          <Button
            variant="accent"
            className="flex-1"
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
            В корзину
          </Button>
        </div>
      </div>
    </article>
  );
}
