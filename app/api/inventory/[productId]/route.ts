import { apiError, apiOk } from "@/lib/api";
import { requireAdmin } from "@/lib/auth";
import { syncInventory } from "@/lib/inventory";
import { inventorySchema } from "@/lib/validations";

export async function PATCH(request: Request, { params }: { params: Promise<{ productId: string }> }) {
  try {
    await requireAdmin();
    const { productId } = await params;
    const body = await request.json();
    const parsed = inventorySchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid payload.");

    const inventory = await syncInventory(productId, parsed.data.inStock, parsed.data.reserved);
    return apiOk({ inventory });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return apiError("Unauthorized.", 401);
    }
    return apiError("Failed to update inventory.", 500);
  }
}
