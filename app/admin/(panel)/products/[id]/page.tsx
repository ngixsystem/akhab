import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { DeleteProductButton } from "@/components/admin/delete-product-button";
import { Badge } from "@/components/ui/badge";
import { getProductById, getSuppliers } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;
  const [product, suppliers] = await Promise.all([getProductById(id), getSuppliers()]);
  if (!product) notFound();

  const initialData = {
    id: product.id,
    slug: product.slug,
    supplierId: product.supplierId,
    companyName: product.companyName,
    productType: product.productType,
    title: product.title,
    description: product.description,
    phone: product.phone,
    telegram: product.telegram || "",
    photos: product.photos,
    isActive: product.isActive,
    size: product.size || "",
    length: product.length || "",
    meterPerTon: product.meterPerTon ? Number(product.meterPerTon) : undefined,
    piecesPerTon: product.piecesPerTon ? Number(product.piecesPerTon) : undefined,
    pricePerTon: product.pricePerTon ? Number(product.pricePerTon) : undefined,
    pricePerPiece: product.pricePerPiece ? Number(product.pricePerPiece) : undefined,
    attributes: product.attributes.map((attribute) => ({
      key: attribute.key,
      value: attribute.value,
      sortOrder: attribute.sortOrder
    }))
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Badge>Edit Product</Badge>
          <h1 className="mt-4 text-4xl font-semibold text-slate-950">{product.title}</h1>
        </div>
        <DeleteProductButton productId={product.id} productTitle={product.title} />
      </div>
      <ProductForm initialData={initialData} suppliers={suppliers} />
    </div>
  );
}
