import { apiError, apiOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { orderSchema } from "@/lib/validations";
import { formatProductType } from "@/lib/utils";

export async function GET() {
  try {
    await requireAdmin();
    const orders = await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
    return apiOk({ orders });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to load orders.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid payload.");

    const products = await prisma.product.findMany({
      where: {
        id: {
          in: parsed.data.items.map((item) => item.productId)
        },
        isActive: true
      }
    });

    if (products.length !== parsed.data.items.length) {
      return apiError("One or more selected products are unavailable.");
    }

    const productMap = new Map(products.map((product) => [product.id, product]));

    const order = await prisma.order.create({
      data: {
        customerName: parsed.data.customerName,
        phone: parsed.data.phone,
        telegram: parsed.data.telegram || null,
        comment: parsed.data.comment || null,
        items: {
          create: parsed.data.items.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              productId: product.id,
              quantity: item.quantity,
              productTitle: product.title,
              productSlug: product.slug,
              productTypeLabel: formatProductType(product.productType),
              unitPrice:
                product.productType === "REBAR"
                  ? Number(product.pricePerPiece ?? product.pricePerTon ?? 0)
                  : null
            };
          })
        }
      },
      include: { items: true }
    });

    await createNotification(
      "NEW_ORDER",
      "Новый заказ",
      `Поступил новый заказ от ${order.customerName}.`,
      { orderId: order.id }
    );

    return apiOk({ order }, 201);
  } catch {
    return apiError("Failed to create order.", 500);
  }
}
