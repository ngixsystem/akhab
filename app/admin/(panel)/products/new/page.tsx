import Link from "next/link";
import { ProductForm } from "@/components/admin/product-form";
import { Badge } from "@/components/ui/badge";
import { BASE_PATH } from "@/lib/constants";
import { getSuppliers } from "@/lib/data";

export default async function CreateProductPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Badge>New Product</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Создать товар</h1>
        </div>
        {suppliers.length === 0 ? (
          <Link href={`${BASE_PATH}/admin/suppliers/new`} className="btn-secondary">
            Сначала добавить поставщика
          </Link>
        ) : null}
      </div>
      <ProductForm suppliers={suppliers} />
    </div>
  );
}
