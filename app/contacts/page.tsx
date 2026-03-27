import { Phone, Send, MapPin } from "lucide-react";
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
      <main className="container-shell py-14">
        <Badge>Контакты</Badge>
        <h1 className="mt-5 text-4xl font-semibold text-slate-950">Связь с отделом продаж</h1>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {[
            { icon: Phone, label: "Телефон", value: settings?.phone || "-" },
            { icon: Send, label: "Telegram", value: settings?.telegram || "-" },
            { icon: MapPin, label: "Адрес", value: settings?.address || "-" }
          ].map((item) => (
            <div key={item.label} className="card p-8">
              <item.icon className="h-8 w-8 text-amber-500" />
              <div className="mt-5 text-sm uppercase tracking-[0.24em] text-slate-500">
                {item.label}
              </div>
              <div className="mt-3 text-xl font-semibold text-slate-950">{item.value}</div>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
