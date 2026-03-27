"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BASE_PATH } from "@/lib/constants";

type DeleteProductButtonProps = {
  productId: string;
  productTitle?: string;
  compact?: boolean;
};

export function DeleteProductButton({ productId, productTitle, compact = false }: DeleteProductButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Удалить товар${productTitle ? ` \"${productTitle}\"` : ""}? Это действие нельзя отменить.`
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_PATH}/api/products/${productId}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || "Не удалось удалить товар.");

      router.push(`${BASE_PATH}/admin/products`);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Ошибка удаления товара.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="secondary"
      className={compact ? "gap-2 text-rose-600 hover:text-rose-700" : "gap-2 border-rose-200 text-rose-600 hover:text-rose-700"}
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
      {loading ? "Удаление..." : compact ? "Удалить" : "Удалить товар"}
    </Button>
  );
}
