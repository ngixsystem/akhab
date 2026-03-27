import { apiError, apiOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { applyOrderInventory } from "@/lib/inventory";
import { createNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { orderStatusSchema } from "@/lib/validations";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: true }
        }
      }
    });
    if (!order) return apiError("Order not found.", 404);
    return apiOk({ order });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to load order.", 500);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = orderStatusSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid payload.");

    const order = await prisma.order.update({
      where: { id },
      data: {
        status: parsed.data.status,
        internalNotes: parsed.data.internalNotes || null
      }
    });

    if (parsed.data.status === "CONFIRMED") {
      await applyOrderInventory(id);
    }

    await createNotification(
      "ORDER_STATUS",
      "Статус заказа обновлен",
      `Заказ ${order.customerName} переведен в статус ${order.status.toLowerCase()}.`,
      { orderId: order.id, status: order.status }
    );

    return apiOk({ order });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to update order.", 500);
  }
}
