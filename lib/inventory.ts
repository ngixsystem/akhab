import { prisma } from "./prisma";

export async function syncInventory(productId: string, inStock: number, reserved: number) {
  const available = Math.max(inStock - reserved, 0);

  return prisma.inventory.upsert({
    where: { productId },
    update: {
      inStock,
      reserved,
      available
    },
    create: {
      productId,
      inStock,
      reserved,
      available
    }
  });
}

export async function applyOrderInventory(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order || order.inventoryAdjusted || order.status !== "CONFIRMED") {
    return order;
  }

  await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      const inventory = await tx.inventory.findUnique({
        where: { productId: item.productId }
      });

      if (!inventory) continue;

      const nextReserved = inventory.reserved + item.quantity;
      const nextAvailable = Math.max(inventory.inStock - nextReserved, 0);

      await tx.inventory.update({
        where: { productId: item.productId },
        data: {
          reserved: nextReserved,
          available: nextAvailable
        }
      });
    }

    await tx.order.update({
      where: { id: order.id },
      data: {
        inventoryAdjusted: true
      }
    });
  });

  return prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });
}
