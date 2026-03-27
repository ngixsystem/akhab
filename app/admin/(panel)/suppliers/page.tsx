import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { DeleteSupplierButton } from "@/components/admin/delete-supplier-button";
import { BASE_PATH } from "@/lib/constants";
import { getSuppliers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminSuppliersPage() {
  const suppliers = await getSuppliers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Badge>Suppliers</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">Поставщики</h1>
        </div>
        <Link href={`${BASE_PATH}/admin/suppliers/new`} className="btn-primary">
          Добавить поставщика
        </Link>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-6 py-4">Название</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Товаров</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4">Описание</th>
                <th className="px-6 py-4" />
              </tr>
            </thead>
            <tbody>
              {suppliers.map((supplier) => (
                <tr key={supplier.id} className="border-t border-slate-100 align-top">
                  <td className="px-6 py-4 font-medium text-slate-950">{supplier.name}</td>
                  <td className="px-6 py-4 text-slate-600">{supplier.slug}</td>
                  <td className="px-6 py-4">{supplier._count.products}</td>
                  <td className="px-6 py-4">{supplier.isActive ? "active" : "hidden"}</td>
                  <td className="px-6 py-4 text-slate-600">{supplier.description || "—"}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-3">
                      <Link href={`${BASE_PATH}/admin/suppliers/${supplier.id}`} className="font-semibold text-slate-950">
                        Редактировать
                      </Link>
                      <DeleteSupplierButton supplierId={supplier.id} disabled={supplier._count.products > 0} />
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
