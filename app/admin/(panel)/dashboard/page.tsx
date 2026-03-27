import { formatDistanceToNow } from "date-fns";
import { Bell, Box, ClipboardList, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <Badge>Dashboard</Badge>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">Операционная сводка</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Products", value: data.products, icon: Package },
          { label: "Orders", value: data.orders, icon: ClipboardList },
          { label: "Unread notifications", value: data.notifications, icon: Bell },
          { label: "Available stock", value: data.inventory._sum.available ?? 0, icon: Box }
        ].map((item) => (
          <div key={item.label} className="card p-6">
            <item.icon className="h-6 w-6 text-amber-500" />
            <div className="mt-5 text-sm text-slate-500">{item.label}</div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-950">Latest orders</h2>
        <div className="mt-6 space-y-4">
          {data.latestOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-2 rounded-3xl border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-semibold text-slate-950">{order.customerName}</div>
                <div className="text-sm text-slate-500">
                  {order.items.length} позиций · {order.status.toLowerCase()}
                </div>
              </div>
              <div className="text-sm text-slate-500">
                {formatDistanceToNow(order.createdAt, { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
