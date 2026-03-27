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
          <h1 className="mt-4 text-4xl font-semibold admin-heading">Управление товарами</h1>
        </div>
        <Link href={`${BASE_PATH}/admin/products/new`} className="btn-primary">
          Добавить товар
        </Link>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table min-w-full text-sm">
            <thead className="text-left">
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
                <tr key={product.id}>
                  <td className="px-6 py-4 font-medium admin-heading">{product.title}</td>
                  <td className="px-6 py-4 admin-muted">{product.supplier.name}</td>
                  <td className="px-6 py-4">{formatProductType(product.productType)}</td>
                  <td className="px-6 py-4">{product.inventory?.available ?? 0}</td>
                  <td className="px-6 py-4">
                    {formatCurrency(product.pricePerPiece?.toString() || product.pricePerTon?.toString())}
                  </td>
                  <td className="px-6 py-4">{product.isActive ? "active" : "hidden"}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Link href={`${BASE_PATH}/admin/products/${product.id}`} className="font-semibold admin-heading">
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
