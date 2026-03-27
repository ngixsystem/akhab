import { apiError, apiOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { supplierSchema } from "@/lib/validations";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });
    if (!supplier) return apiError("Supplier not found.", 404);
    return apiOk({ supplier });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to load supplier.", 500);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = supplierSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid payload.");

    const supplier = await prisma.supplier.update({
      where: { id },
      data: {
        slug: parsed.data.slug,
        name: parsed.data.name,
        description: parsed.data.description || null,
        isActive: parsed.data.isActive
      }
    });

    return apiOk({ supplier });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to update supplier.", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const supplier = await prisma.supplier.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (!supplier) return apiError("Supplier not found.", 404);
    if (supplier._count.products > 0) return apiError("Нельзя удалить поставщика, пока к нему привязаны товары.", 400);

    await prisma.supplier.delete({ where: { id } });
    return apiOk({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to delete supplier.", 500);
  }
}
