import { ProductForm } from "@/components/admin/product-form";
import { Badge } from "@/components/ui/badge";

export default function CreateProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <Badge>New Product</Badge>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">Создать товар</h1>
      </div>
      <ProductForm />
    </div>
  );
}
