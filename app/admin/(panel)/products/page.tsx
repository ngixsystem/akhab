import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { BASE_PATH } from "@/lib/constants";
import { getAdminProducts } from "@/lib/data";
import { formatCurrency, formatProductType } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Badge>Products</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Управление товарами</h1>
        </div>
        <Link href={`${BASE_PATH}/admin/products/new`} className="btn-primary">
          Добавить товар
        </Link>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-6 py-4">Название</th>
                <th className="px-6 py-4">Поставщик</th>
                <th className="px-6 py-4">Тип</th>
                <th className="px-6 py-4">Остаток</th>
                <th className="px-6 py-4">Цена</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-slate-100">
                  <td className="px-6 py-4 font-medium text-slate-950">{product.title}</td>
                  <td className="px-6 py-4 text-slate-600">{product.supplier.name}</td>
                  <td className="px-6 py-4">{formatProductType(product.productType)}</td>
                  <td className="px-6 py-4">{product.inventory?.available ?? 0}</td>
                  <td className="px-6 py-4">
                    {formatCurrency(product.pricePerPiece?.toString() || product.pricePerTon?.toString())}
                  </td>
                  <td className="px-6 py-4">{product.isActive ? "active" : "hidden"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`${BASE_PATH}/admin/products/${product.id}`} className="font-semibold text-slate-950">
                        Редактировать
                      </Link>
                      <DeleteProductButton compact productId={product.id} productTitle={product.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
