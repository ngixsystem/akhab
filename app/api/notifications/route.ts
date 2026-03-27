import { apiError, apiOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await requireAdmin();
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: "desc" },
      take: 50
    });
    return apiOk({ notifications });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to load notifications.", 500);
  }
}
