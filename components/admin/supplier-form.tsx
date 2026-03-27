"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BASE_PATH } from "@/lib/constants";
import { slugify } from "@/lib/utils";

type SupplierFormValue = {
  id?: string;
  slug: string;
  name: string;
  description: string;
  isActive: boolean;
};

const emptyForm: SupplierFormValue = {
  slug: "",
  name: "",
  description: "",
  isActive: true
};

export function SupplierForm({ initialData }: Readonly<{ initialData?: SupplierFormValue }>) {
  const router = useRouter();
  const [form, setForm] = useState<SupplierFormValue>(initialData ?? emptyForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      slug: form.slug || slugify(form.name)
    };

    const endpoint = form.id ? `${BASE_PATH}/api/suppliers/${form.id}` : `${BASE_PATH}/api/suppliers`;
    const method = form.id ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось сохранить поставщика.");

      router.push(`${BASE_PATH}/admin/suppliers`);
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ошибка сохранения.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <div className="grid gap-5 md:grid-cols-2">
          <Field label="Название поставщика">
            <Input
              value={form.name}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  name: e.target.value,
                  slug: current.slug || slugify(e.target.value)
                }))
              }
            />
          </Field>
          <Field label="Slug">
            <Input value={form.slug} onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))} />
          </Field>
          <div className="md:col-span-2">
            <label className="label">Описание</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
              placeholder="Коротко опишите поставщика, географию или специализацию"
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((current) => ({ ...current, isActive: e.target.checked }))}
          />
          Показывать поставщика на витрине
        </label>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        <div className="mt-6 flex gap-3">
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push(`${BASE_PATH}/admin/suppliers`)}>
            Отмена
          </Button>
        </div>
      </div>
    </form>
  );
}

function Field({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div>
      <label className="label">{label}</label>
      {children}
    </div>
  );
}
