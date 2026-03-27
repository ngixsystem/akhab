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
    <footer className="mt-16 border-t border-slate-200/80 bg-white/70">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-500">
            Planner
          </div>
          <p className="mt-3 text-sm text-slate-600">
            Индустриальная B2B витрина для арматуры и профильной продукции.
          </p>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">Контакты</div>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>{settings?.companyName}</p>
            <p>{settings?.phone}</p>
            <p>{settings?.telegram || "Telegram не указан"}</p>
            <p>{settings?.address || "Адрес не указан"}</p>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">Режим работы</div>
          <p className="mt-3 text-sm text-slate-600">
            Пн-Сб, 09:00-19:00. Оперативно подтверждаем заявки и держим остатки в актуальном состоянии.
          </p>
        </div>
      </div>
    </footer>
  );
}
