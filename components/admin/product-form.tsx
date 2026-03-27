"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BASE_PATH, PRODUCT_TYPE_OPTIONS } from "@/lib/constants";
import { slugify } from "@/lib/utils";

type ProductFormValue = {
  id?: string;
  slug: string;
  companyName: string;
  productType: "REBAR" | "PROFILE";
  title: string;
  description: string;
  phone: string;
  telegram: string;
  photos: string[];
  isActive: boolean;
  size?: string;
  length?: string;
  meterPerTon?: number;
  piecesPerTon?: number;
  pricePerTon?: number;
  pricePerPiece?: number;
  attributes: { key: string; value: string; sortOrder: number }[];
};

const emptyForm: ProductFormValue = {
  slug: "",
  companyName: "METIS Metal Supply",
  productType: "REBAR",
  title: "",
  description: "",
  phone: "+998 90 000 00 00",
  telegram: "@metis_metal",
  photos: [],
  isActive: true,
  size: "",
  length: "",
  meterPerTon: undefined,
  piecesPerTon: undefined,
  pricePerTon: undefined,
  pricePerPiece: undefined,
  attributes: [{ key: "", value: "", sortOrder: 0 }]
};

export function ProductForm({ initialData }: Readonly<{ initialData?: ProductFormValue }>) {
  const router = useRouter();
  const [form, setForm] = useState<ProductFormValue>(initialData ?? emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);
    setError("");

    try {
      const body = new FormData();
      Array.from(files).forEach((file) => body.append("files", file));
      const response = await fetch(`${BASE_PATH}/api/upload`, { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось загрузить файл.");

      setForm((current) => ({
        ...current,
        photos: [...current.photos, ...data.files]
      }));
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ошибка загрузки.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      ...form,
      slug: form.slug || slugify(form.title),
      attributes: form.attributes.filter((attribute) => attribute.key && attribute.value)
    };

    const endpoint = form.id ? `${BASE_PATH}/api/products/${form.id}` : `${BASE_PATH}/api/products`;
    const method = form.id ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось сохранить товар.");

      setSuccess("Товар сохранен.");
      router.push(`${BASE_PATH}/admin/products`);
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
          <Field label="Название">
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  title: e.target.value,
                  slug: current.slug || slugify(e.target.value)
                }))
              }
            />
          </Field>
          <Field label="Slug">
            <Input value={form.slug} onChange={(e) => setForm((current) => ({ ...current, slug: e.target.value }))} />
          </Field>
          <Field label="Компания">
            <Input
              value={form.companyName}
              onChange={(e) => setForm((current) => ({ ...current, companyName: e.target.value }))}
            />
          </Field>
          <Field label="Тип товара">
            <Select
              value={form.productType}
              onChange={(e) =>
                setForm((current) => ({
                  ...current,
                  productType: e.target.value as "REBAR" | "PROFILE"
                }))
              }
            >
              {PRODUCT_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Телефон">
            <Input value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} />
          </Field>
          <Field label="Telegram">
            <Input value={form.telegram} onChange={(e) => setForm((current) => ({ ...current, telegram: e.target.value }))} />
          </Field>
          <div className="md:col-span-2">
            <label className="label">Описание</label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((current) => ({ ...current, description: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-950">Фотографии</h2>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <Input type="file" accept="image/*" multiple onChange={(e) => uploadFiles(e.target.files)} />
          {uploading ? <span className="text-sm text-slate-500">Загрузка...</span> : null}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {form.photos.map((photo) => (
            <img key={photo} src={`${BASE_PATH}${photo}`} alt={photo} className="h-40 w-full rounded-3xl object-cover" />
          ))}
        </div>
      </div>

      {form.productType === "REBAR" ? (
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-slate-950">Характеристики арматуры</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <Field label="Размер">
              <Input value={form.size || ""} onChange={(e) => setForm((current) => ({ ...current, size: e.target.value }))} />
            </Field>
            <Field label="Длина">
              <Input value={form.length || ""} onChange={(e) => setForm((current) => ({ ...current, length: e.target.value }))} />
            </Field>
            <Field label="Метров в тонне">
              <Input type="number" value={form.meterPerTon ?? ""} onChange={(e) => setForm((current) => ({ ...current, meterPerTon: Number(e.target.value) || undefined }))} />
            </Field>
            <Field label="Штук в тонне">
              <Input type="number" value={form.piecesPerTon ?? ""} onChange={(e) => setForm((current) => ({ ...current, piecesPerTon: Number(e.target.value) || undefined }))} />
            </Field>
            <Field label="Цена за тонну">
              <Input type="number" value={form.pricePerTon ?? ""} onChange={(e) => setForm((current) => ({ ...current, pricePerTon: Number(e.target.value) || undefined }))} />
            </Field>
            <Field label="Цена за штуку">
              <Input type="number" value={form.pricePerPiece ?? ""} onChange={(e) => setForm((current) => ({ ...current, pricePerPiece: Number(e.target.value) || undefined }))} />
            </Field>
          </div>
        </div>
      ) : (
        <div className="card p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-xl font-semibold text-slate-950">Атрибуты профиля</h2>
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  attributes: [...current.attributes, { key: "", value: "", sortOrder: current.attributes.length }]
                }))
              }
            >
              Добавить атрибут
            </Button>
          </div>
          <div className="mt-5 space-y-4">
            {form.attributes.map((attribute, index) => (
              <div key={`${index}-${attribute.key}`} className="grid gap-4 md:grid-cols-[1fr_1fr_120px]">
                <Input
                  placeholder="Ключ"
                  value={attribute.key}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      attributes: current.attributes.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, key: e.target.value } : item
                      )
                    }))
                  }
                />
                <Input
                  placeholder="Значение"
                  value={attribute.value}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      attributes: current.attributes.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, value: e.target.value } : item
                      )
                    }))
                  }
                />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      attributes: current.attributes.filter((_, itemIndex) => itemIndex !== index)
                    }))
                  }
                >
                  Удалить
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card p-6">
        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((current) => ({ ...current, isActive: e.target.checked }))}
          />
          Товар активен на витрине
        </label>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        {success ? <p className="mt-4 text-sm text-emerald-600">{success}</p> : null}
        <div className="mt-6 flex gap-3">
          <Button type="submit" variant="accent" disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.push(`${BASE_PATH}/admin/products`)}>
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
