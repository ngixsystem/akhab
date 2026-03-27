import { apiError, apiOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { toProductPayload } from "@/lib/data";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { inventory: true, attributes: true }
    });
    if (!product) return apiError("Product not found.", 404);
    return apiOk({ product });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to load product.", 500);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid payload.");

    const data = toProductPayload(parsed.data);
    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        attributes: {
          deleteMany: {},
          create: parsed.data.productType === "PROFILE" ? parsed.data.attributes : []
        }
      },
      include: {
        inventory: true,
        attributes: true
      }
    });

    return apiOk({ product });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to update product.", 500);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await prisma.product.delete({ where: { id } });
    return apiOk({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to delete product.", 500);
  }
}
