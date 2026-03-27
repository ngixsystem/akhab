"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "./product-card";

type Product = {
  id: string;
  slug: string;
  title: string;
  description: string;
  productType: "REBAR" | "PROFILE";
  photos: string[];
  size: string | null;
  length: string | null;
  pricePerPiece: number | string | { toString(): string } | null;
  pricePerTon: number | string | { toString(): string } | null;
  inventory: { available: number } | null;
};

export function CatalogClient({ products }: Readonly<{ products: Product[] }>) {
  const [search, setSearch] = useState("");
  const [selectedSize, setSelectedSize] = useState("Все");
  const [stockOnly, setStockOnly] = useState(false);

  const sizes = useMemo(() => {
    const values = Array.from(new Set(products.map((product) => product.size).filter(Boolean)));
    return ["Все", ...values] as string[];
  }, [products]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products
      .filter((product) => {
        if (!query) return true;
        return [product.title, product.description, product.productType, product.size || "", product.length || ""]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .filter((product) => (selectedSize === "Все" ? true : product.size === selectedSize))
      .filter((product) => (stockOnly ? (product.inventory?.available ?? 0) > 0 : true));
  }, [products, search, selectedSize, stockOnly]);

  return (
    <>
      <div className="mt-10 flex flex-col gap-4">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Поиск по названию, типу, описанию..."
            className="input pl-11"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <SlidersHorizontal className="hidden h-4 w-4 text-slate-500 sm:block" />
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={selectedSize === size ? "rounded-sm border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs uppercase tracking-[0.16em] text-blue-100" : "rounded-sm border border-border bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.16em] text-slate-400 transition hover:border-slate-500/40 hover:text-white"}
            >
              {size}
            </button>
          ))}
          <label className="ml-auto inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-400">
            <input type="checkbox" checked={stockOnly} onChange={(event) => setStockOnly(event.target.checked)} className="accent-blue-500" />
            В наличии
          </label>
        </div>
      </div>

      <div className="mt-6 text-xs uppercase tracking-[0.18em] text-slate-500">Найдено позиций: {filtered.length}</div>

      {filtered.length > 0 ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-sm border border-border bg-white/5 p-10 text-center text-slate-400">
          Ничего не найдено. Попробуйте сбросить фильтры или изменить запрос.
        </div>
      )}
    </>
  );
}
