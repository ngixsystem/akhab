import { prisma } from "./prisma";

export async function createNotification(
  type: "NEW_ORDER" | "ORDER_STATUS" | "STOCK_ALERT" | "SYSTEM",
  title: string,
  message: string,
  metadata?: Record<string, unknown>
) {
  return prisma.notification.create({
    data: {
      type,
      title,
      message,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : undefined
    }
  });
}
