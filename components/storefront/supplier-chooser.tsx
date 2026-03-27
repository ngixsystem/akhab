import Link from "next/link";
import { ArrowRight, Factory, PackageOpen } from "lucide-react";
import { BASE_PATH } from "@/lib/constants";

type SupplierCard = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  _count: {
    products: number;
  };
};

export function SupplierChooser({ suppliers, selectedSupplierSlug }: Readonly<{ suppliers: SupplierCard[]; selectedSupplierSlug?: string | null }>) {
  return (
    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {suppliers.map((supplier) => {
        const isSelected = supplier.slug === selectedSupplierSlug;

        return (
          <Link
            key={supplier.id}
            href={`${BASE_PATH}/catalog/${supplier.slug}`}
            className={isSelected ? "group rounded-sm border border-blue-500/40 bg-blue-500/10 p-6 text-white shadow-[0_12px_32px_rgba(0,0,0,0.22)]" : "group rounded-sm border border-border bg-white/5 p-6 text-white transition hover:-translate-y-1 hover:border-[#36507d] hover:bg-white/[0.07]"}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                  <Factory className="h-3.5 w-3.5" /> Поставщик
                </div>
                <h2 className="mt-4 text-3xl leading-none">{supplier.name}</h2>
              </div>
              <div className="rounded-full border border-white/10 px-3 py-2 text-xs uppercase tracking-[0.18em] text-slate-300">
                {supplier._count.products} поз.
              </div>
            </div>

            <p className="mt-4 min-h-[72px] text-sm leading-7 text-slate-400">
              {supplier.description || "Актуальный ассортимент и остатки по этому поставщику доступны в отдельной витрине."}
            </p>

            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-blue-100">
              <PackageOpen className="h-4 w-4" /> Смотреть товары <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
