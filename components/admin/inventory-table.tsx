"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BASE_PATH, PRODUCT_TYPE_OPTIONS } from "@/lib/constants";

type Row = {
  id: string;
  title: string;
  productType: "REBAR" | "PROFILE";
  inventory: {
    inStock: number;
    reserved: number;
    available: number;
  } | null;
};

export function InventoryTable({ rows }: Readonly<{ rows: Row[] }>) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [state, setState] = useState<Record<string, { inStock: number; reserved: number }>>(
    Object.fromEntries(
      rows.map((row) => [
        row.id,
        {
          inStock: row.inventory?.inStock ?? 0,
          reserved: row.inventory?.reserved ?? 0
        }
      ])
    )
  );

  async function save(productId: string) {
    setLoadingId(productId);
    const response = await fetch(`${BASE_PATH}/api/inventory/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state[productId])
    });
    setLoadingId(null);
    if (response.ok) router.refresh();
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="admin-table min-w-full text-sm">
          <thead className="text-left">
            <tr>
              <th className="px-6 py-4">Товар</th>
              <th className="px-6 py-4">Тип</th>
              <th className="px-6 py-4">В наличии</th>
              <th className="px-6 py-4">Резерв</th>
              <th className="px-6 py-4">Доступно</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="px-6 py-4 font-medium admin-heading">{row.title}</td>
                <td className="px-6 py-4">
                  {PRODUCT_TYPE_OPTIONS.find((item) => item.value === row.productType)?.label}
                </td>
                <td className="px-6 py-4">
                  <Input
                    type="number"
                    value={state[row.id]?.inStock ?? 0}
                    onChange={(e) =>
                      setState((current) => ({
                        ...current,
                        [row.id]: {
                          ...current[row.id],
                          inStock: Number(e.target.value)
                        }
                      }))
                    }
                    className="w-28"
                  />
                </td>
                <td className="px-6 py-4">
                  <Input
                    type="number"
                    value={state[row.id]?.reserved ?? 0}
                    onChange={(e) =>
                      setState((current) => ({
                        ...current,
                        [row.id]: {
                          ...current[row.id],
                          reserved: Number(e.target.value)
                        }
                      }))
                    }
                    className="w-28"
                  />
                </td>
                <td className="px-6 py-4">
                  {Math.max((state[row.id]?.inStock ?? 0) - (state[row.id]?.reserved ?? 0), 0)}
                </td>
                <td className="px-6 py-4">
                  <Button type="button" variant="secondary" onClick={() => save(row.id)} disabled={loadingId === row.id}>
                    {loadingId === row.id ? "..." : "Сохранить"}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
