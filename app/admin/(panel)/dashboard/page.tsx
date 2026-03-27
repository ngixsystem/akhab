import { formatDistanceToNow } from "date-fns";
import { Bell, Box, ClipboardList, Factory, Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getDashboardData } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-8">
      <div>
        <Badge>Dashboard</Badge>
        <h1 className="mt-4 text-4xl font-semibold admin-heading">Операционная сводка</h1>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {[
          { label: "Products", value: data.products, icon: Package },
          { label: "Suppliers", value: data.suppliers, icon: Factory },
          { label: "Orders", value: data.orders, icon: ClipboardList },
          { label: "Unread notifications", value: data.notifications, icon: Bell },
          { label: "Available stock", value: data.inventory._sum.available ?? 0, icon: Box }
        ].map((item) => (
          <div key={item.label} className="card p-6">
            <item.icon className="h-6 w-6 text-amber-500" />
            <div className="mt-5 text-sm admin-muted">{item.label}</div>
            <div className="mt-2 text-3xl font-semibold admin-heading">{item.value}</div>
          </div>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="text-xl font-semibold admin-heading">Latest orders</h2>
        <div className="mt-6 space-y-4">
          {data.latestOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-2 rounded-3xl admin-subtle p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-semibold admin-heading">{order.customerName}</div>
                <div className="text-sm admin-muted">
                  {order.items.length} позиций · {order.status.toLowerCase()}
                </div>
              </div>
              <div className="text-sm admin-muted">
                {formatDistanceToNow(order.createdAt, { addSuffix: true })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
