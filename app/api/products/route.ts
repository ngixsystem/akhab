import { apiError, apiOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toProductPayload } from "@/lib/data";
import { productSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const supplierSlug = searchParams.get("supplier");

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      supplier: supplierSlug
        ? {
            slug: supplierSlug,
            isActive: true
          }
        : undefined
    },
    include: {
      supplier: true,
      inventory: true,
      attributes: { orderBy: { sortOrder: "asc" } }
    },
    orderBy: { createdAt: "desc" }
  });

  return apiOk({ products });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json();
    const parsed = productSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid payload.");

    const supplier = await prisma.supplier.findUnique({ where: { id: parsed.data.supplierId } });
    if (!supplier) return apiError("Supplier not found.", 404);

    const data = toProductPayload(parsed.data);
    const product = await prisma.product.create({
      data: {
        ...data,
        attributes: {
          create: parsed.data.productType === "PROFILE" ? parsed.data.attributes : []
        },
        inventory: {
          create: {
            inStock: 0,
            reserved: 0,
            available: 0
          }
        }
      },
      include: {
        supplier: true,
        attributes: true,
        inventory: true
      }
    });

    return apiOk({ product }, 201);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to create product.", 500);
  }
}
