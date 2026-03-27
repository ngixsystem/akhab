import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BASE_PATH } from "@/lib/constants";
import { getOrders } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div className="space-y-6">
      <div>
        <Badge>Orders</Badge>
        <h1 className="mt-4 text-4xl font-semibold admin-heading">Заказы клиентов</h1>
      </div>
      <div className="grid gap-4">
        {orders.map((order) => (
          <Link key={order.id} href={`${BASE_PATH}/admin/orders/${order.id}`} className="card p-6 transition hover:-translate-y-0.5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-lg font-semibold admin-heading">{order.customerName}</div>
                <div className="mt-1 text-sm admin-muted">
                  {order.phone} · {order.items.length} позиций
                </div>
              </div>
              <div className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em] text-slate-100">
                {order.status.toLowerCase()}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
