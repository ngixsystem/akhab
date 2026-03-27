"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BASE_PATH, ORDER_STATUS_OPTIONS } from "@/lib/constants";

export function OrderStatusForm({
  orderId,
  initialStatus,
  initialNotes
}: Readonly<{
  orderId: string;
  initialStatus: string;
  initialNotes: string;
}>) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [internalNotes, setInternalNotes] = useState(initialNotes);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const response = await fetch(`${BASE_PATH}/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, internalNotes })
    });

    const data = await response.json();
    setMessage(response.ok ? "Статус обновлен." : data.error || "Ошибка обновления.");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <h2 className="text-xl font-semibold text-slate-950">Управление заказом</h2>
      <div className="mt-5 space-y-5">
        <div>
          <label className="label">Статус</label>
          <Select value={status} onChange={(e) => setStatus(e.target.value)}>
            {ORDER_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label className="label">Внутренние заметки</label>
          <Textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} />
        </div>
      </div>
      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      <Button type="submit" variant="accent" className="mt-5 w-full" disabled={loading}>
        {loading ? "Обновление..." : "Обновить"}
      </Button>
    </form>
  );
}
