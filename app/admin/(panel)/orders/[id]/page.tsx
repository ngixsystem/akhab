import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { OrderStatusForm } from "@/components/admin/order-status-form";
import { getOrderById } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailPage({
  params
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Badge>Order Detail</Badge>
        <h1 className="mt-4 text-4xl font-semibold admin-heading">{order.customerName}</h1>
      </div>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="card p-6">
          <h2 className="text-xl font-semibold admin-heading">Товары в заказе</h2>
          <div className="mt-6 space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="rounded-3xl admin-subtle p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-semibold admin-heading">{item.productTitle}</div>
                    <div className="text-sm admin-muted">{item.productTypeLabel}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold admin-heading">x{item.quantity}</div>
                    <div className="text-sm admin-muted">
                      {formatCurrency(item.unitPrice?.toString())}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-xl font-semibold admin-heading">Контакты</h2>
            <div className="mt-4 space-y-3 text-sm admin-muted">
              <p>{order.phone}</p>
              <p>{order.telegram || "Telegram не указан"}</p>
              <p>{order.comment || "Комментарий не указан"}</p>
            </div>
          </div>
          <OrderStatusForm
            orderId={order.id}
            initialStatus={order.status}
            initialNotes={order.internalNotes || ""}
          />
        </div>
      </div>
    </div>
  );
}
