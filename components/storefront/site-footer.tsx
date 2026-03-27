import Link from "next/link";
import { MapPin, MessageCircle, Phone } from "lucide-react";
import { BASE_PATH } from "@/lib/constants";

export function SiteFooter({
  settings
}: Readonly<{
  settings:
    | {
        companyName: string;
        phone: string;
        telegram: string | null;
        address: string | null;
      }
    | null;
}>) {
  return (
    <footer className="mt-16 border-t border-border bg-slate-950/70">
      <div className="container-shell grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-7 w-0.5 rounded-full bg-gradient-steel" />
            <span className="text-2xl tracking-[0.16em] text-white">METIS</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            Индустриальная витрина для арматуры и профильной продукции с актуальными остатками и прямой заявкой в отдел продаж.
          </p>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-white">Навигация</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li><Link href={`${BASE_PATH}`} className="transition hover:text-white">Главная</Link></li>
            <li><Link href={`${BASE_PATH}/catalog`} className="transition hover:text-white">Каталог</Link></li>
            <li><Link href={`${BASE_PATH}/checkout`} className="transition hover:text-white">Оставить заявку</Link></li>
            <li><Link href={`${BASE_PATH}/contacts`} className="transition hover:text-white">Контакты</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-white">Контакты</h4>
          <ul className="mt-4 space-y-3 text-sm text-slate-400">
            <li className="flex items-start gap-2">
              <Phone className="mt-0.5 h-4 w-4 text-blue-400" />
              <span>{settings?.phone || "Телефон не указан"}</span>
            </li>
            <li className="flex items-start gap-2">
              <MessageCircle className="mt-0.5 h-4 w-4 text-blue-400" />
              <span>{settings?.telegram || "Telegram не указан"}</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 text-blue-400" />
              <span>{settings?.address || "Адрес не указан"}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm uppercase tracking-[0.2em] text-white">METIS</h4>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            {settings?.companyName || "METIS"} помогает быстро подобрать позиции, проверить наличие и передать заказ без лишних согласований.
          </p>
        </div>
      </div>

      <div className="container-shell flex flex-col gap-3 border-t border-border py-5 text-xs uppercase tracking-[0.18em] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 METIS</p>
        <p>Industrial storefront / admin preserved</p>
      </div>
    </footer>
  );
}
