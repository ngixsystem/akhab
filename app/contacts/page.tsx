import { MapPin, Phone, Send } from "lucide-react";
import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { Badge } from "@/components/ui/badge";
import { getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ContactsPage() {
  const settings = await getStoreSettings();

  return (
    <div>
      <SiteHeader />
      <main className="container-shell py-10 sm:py-14">
        <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-100">Контакты</Badge>
        <h1 className="mt-5 max-w-3xl text-5xl leading-none text-white sm:text-6xl">Связь с отделом продаж</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
          Быстрый канал связи для согласования заказа, уточнения остатков и получения коммерческого предложения.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[
            { icon: Phone, label: "Телефон", value: settings?.phone || "-" },
            { icon: Send, label: "Telegram", value: settings?.telegram || "-" },
            { icon: MapPin, label: "Адрес", value: settings?.address || "-" }
          ].map((item) => (
            <div key={item.label} className="card p-6 sm:p-8">
              <item.icon className="h-8 w-8 text-blue-400" />
              <div className="mt-5 text-xs uppercase tracking-[0.24em] text-slate-500">{item.label}</div>
              <div className="mt-3 break-words text-xl text-white sm:text-2xl">{item.value}</div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
