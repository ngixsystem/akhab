import { notFound } from "next/navigation";
import { SupplierForm } from "@/components/admin/supplier-form";
import { Badge } from "@/components/ui/badge";
import { getSupplierById } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditSupplierPage({
  params
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const supplier = await getSupplierById(id);
  if (!supplier) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Badge>Edit Supplier</Badge>
        <h1 className="mt-4 text-4xl font-semibold admin-heading">{supplier.name}</h1>
      </div>
      <SupplierForm
        initialData={{
          id: supplier.id,
          slug: supplier.slug,
          name: supplier.name,
          description: supplier.description || "",
          isActive: supplier.isActive
        }}
      />
    </div>
  );
}
