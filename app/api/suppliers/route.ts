import { apiError, apiOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supplierSchema } from "@/lib/validations";

export async function GET() {
  const suppliers = await prisma.supplier.findMany({
    include: {
      _count: {
        select: {
          products: true
        }
      }
    },
    orderBy: { name: "asc" }
  });

  return apiOk({ suppliers });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = supplierSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid payload.");

    const supplier = await prisma.supplier.create({
      data: {
        slug: parsed.data.slug,
        name: parsed.data.name,
        description: parsed.data.description || null,
        isActive: parsed.data.isActive
      }
    });

    return apiOk({ supplier }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to create supplier.", 500);
  }
}
