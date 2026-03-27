import { apiError, apiOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { settingSchema } from "@/lib/validations";

export async function GET() {
  const settings = await prisma.storeSetting.findUnique({ where: { id: 1 } });
  return apiOk({ settings });
}

export async function PATCH(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = settingSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid payload.");

    const settings = await prisma.storeSetting.upsert({
      where: { id: 1 },
      update: parsed.data,
      create: {
        id: 1,
        ...parsed.data
      }
    });

    return apiOk({ settings });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to update settings.", 500);
  }
}
