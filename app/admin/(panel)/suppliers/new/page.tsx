import { SupplierForm } from "@/components/admin/supplier-form";
import { Badge } from "@/components/ui/badge";

export default function CreateSupplierPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge>New Supplier</Badge>
        <h1 className="mt-4 text-4xl font-semibold admin-heading">Создать поставщика</h1>
      </div>
      <SupplierForm />
    </div>
  );
}
