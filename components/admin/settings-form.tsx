"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BASE_PATH } from "@/lib/constants";

type SettingsValue = {
  companyName: string;
  phone: string;
  telegram: string;
  address: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
};

export function SettingsForm({ initialData }: Readonly<{ initialData: SettingsValue }>) {
  const router = useRouter();
  const [form, setForm] = useState(initialData);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const response = await fetch(`${BASE_PATH}/api/settings`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    });
    const data = await response.json();
    setMessage(response.ok ? "Настройки сохранены." : data.error || "Ошибка сохранения.");
    setLoading(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Название компании">
          <Input value={form.companyName} onChange={(e) => setForm((current) => ({ ...current, companyName: e.target.value }))} />
        </Field>
        <Field label="Телефон">
          <Input value={form.phone} onChange={(e) => setForm((current) => ({ ...current, phone: e.target.value }))} />
        </Field>
        <Field label="Telegram">
          <Input value={form.telegram} onChange={(e) => setForm((current) => ({ ...current, telegram: e.target.value }))} />
        </Field>
        <Field label="Адрес">
          <Input value={form.address} onChange={(e) => setForm((current) => ({ ...current, address: e.target.value }))} />
        </Field>
        <div className="md:col-span-2">
          <label className="label">Hero title</label>
          <Input value={form.heroTitle} onChange={(e) => setForm((current) => ({ ...current, heroTitle: e.target.value }))} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Hero subtitle</label>
          <Textarea value={form.heroSubtitle} onChange={(e) => setForm((current) => ({ ...current, heroSubtitle: e.target.value }))} />
        </div>
        <div className="md:col-span-2">
          <label className="label">About text</label>
          <Textarea value={form.aboutText} onChange={(e) => setForm((current) => ({ ...current, aboutText: e.target.value }))} />
        </div>
      </div>
      {message ? <p className="mt-4 text-sm text-slate-600">{message}</p> : null}
      <Button type="submit" variant="accent" className="mt-6" disabled={loading}>
        {loading ? "Сохранение..." : "Сохранить"}
      </Button>
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
