import { Badge } from "@/components/ui/badge";
import { InventoryTable } from "@/components/admin/inventory-table";
import { getInventoryRows } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function InventoryPage() {
  const rows = await getInventoryRows();

  return (
    <div className="space-y-6">
      <div>
        <Badge>Inventory</Badge>
        <h1 className="mt-4 text-4xl font-semibold admin-heading">Контроль остатков</h1>
      </div>
      <InventoryTable rows={rows} />
    </div>
  );
}
