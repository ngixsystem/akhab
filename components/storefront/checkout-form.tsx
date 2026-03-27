"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { BASE_PATH } from "@/lib/constants";
import { assetPath, formatCurrency } from "@/lib/utils";
import { useCart } from "./cart-provider";

export function CheckoutForm() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clear } = useCart();
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [telegram, setTelegram] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0),
    [items]
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`${BASE_PATH}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName,
          phone,
          telegram,
          comment,
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Не удалось оформить заказ.");

      clear();
      setSuccess("Заказ отправлен. Менеджер свяжется с вами после подтверждения.");
      router.refresh();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Ошибка запроса.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="card p-8 text-center">
        <p className="text-lg font-semibold text-slate-900">Корзина пока пустая</p>
        <p className="mt-2 text-sm text-slate-600">
          Выберите товары в каталоге и затем вернитесь к оформлению заказа.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
      <form className="card p-6 sm:p-8" onSubmit={handleSubmit}>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-950">Контакты заказчика</h2>
          <p className="mt-2 text-sm text-slate-600">
            Заполните данные, и заявка поступит в админ-панель как новый заказ.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="label">Имя / компания</label>
            <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Телефон</label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>
          <div className="md:col-span-2">
            <label className="label">Telegram</label>
            <Input value={telegram} onChange={(e) => setTelegram(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="label">Комментарий</label>
            <Textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
        </div>
        {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
        {success ? <p className="mt-4 text-sm text-emerald-600">{success}</p> : null}
        <Button type="submit" variant="accent" className="mt-6 w-full" disabled={isSubmitting}>
          {isSubmitting ? "Отправка..." : "Отправить заказ"}
        </Button>
      </form>

      <aside className="card p-6 sm:p-8">
        <h3 className="text-xl font-semibold text-slate-950">Состав заказа</h3>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={item.productId} className="rounded-3xl border border-slate-100 bg-slate-50 p-4">
              <div className="flex gap-4">
                <img src={assetPath(item.photo)} alt={item.title} className="h-20 w-20 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-900">{item.title}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-500">
                    {item.productType}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
                      className="w-24"
                    />
                    <button type="button" onClick={() => removeItem(item.productId)} className="text-sm font-medium text-rose-600">
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-3xl bg-slate-950 p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-300">Оценочная сумма</span>
            <span className="text-xl font-semibold">{formatCurrency(total)}</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            Итоговая стоимость подтверждается менеджером после проверки наличия.
          </p>
        </div>
      </aside>
    </div>
  );
}
