"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BASE_PATH } from "@/lib/constants";

export function DeleteSupplierButton({ supplierId, disabled }: Readonly<{ supplierId: string; disabled?: boolean }>) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!window.confirm("Удалить поставщика? Это действие доступно только если за ним не закреплены товары.")) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_PATH}/api/suppliers/${supplierId}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось удалить поставщика.");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ошибка удаления.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button type="button" variant="secondary" className="text-rose-600 hover:text-rose-700" onClick={handleDelete} disabled={disabled || loading}>
        {loading ? "Удаление..." : "Удалить"}
      </Button>
      {error ? <p className="max-w-56 text-right text-xs text-rose-600">{error}</p> : null}
    </div>
  );
}
