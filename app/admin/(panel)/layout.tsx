import Link from "next/link";
import { Bell, Boxes, Factory, LayoutDashboard, Package2, Settings, ShoppingCart } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/server";
import { BASE_PATH } from "@/lib/constants";

export const dynamic = "force-dynamic";

const items = [
  { href: `${BASE_PATH}/admin/dashboard`, label: "Dashboard", icon: LayoutDashboard },
  { href: `${BASE_PATH}/admin/suppliers`, label: "Suppliers", icon: Factory },
  { href: `${BASE_PATH}/admin/products`, label: "Products", icon: Package2 },
  { href: `${BASE_PATH}/admin/orders`, label: "Orders", icon: ShoppingCart },
  { href: `${BASE_PATH}/admin/inventory`, label: "Inventory", icon: Boxes },
  { href: `${BASE_PATH}/admin/notifications`, label: "Notifications", icon: Bell },
  { href: `${BASE_PATH}/admin/settings`, label: "Settings", icon: Settings }
];

export default async function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  await requireAdminPage();
  const unread = await prisma.notification.count({ where: { isRead: false } });

  return (
    <div className="admin-shell min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-[1600px] lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-slate-800/80 bg-slate-950/60 p-6 backdrop-blur-xl">
          <Link href={`${BASE_PATH}/admin/dashboard`} className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-400 px-3 py-2 text-xs font-bold tracking-[0.3em] text-slate-950 shadow-[0_12px_30px_rgba(251,191,36,0.25)]">
              PLNR
            </div>
            <div>
              <div className="font-semibold">METIKS Admin</div>
              <div className="text-xs text-slate-500">metal operations panel</div>
            </div>
          </Link>
          <nav className="mt-10 space-y-2">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-slate-300 transition hover:bg-slate-900/80 hover:text-white"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.label === "Notifications" && unread > 0 ? (
                  <span className="ml-auto rounded-full bg-amber-400 px-2 py-1 text-xs font-bold text-slate-950">
                    {unread}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="bg-transparent">
          <div className="border-b border-slate-800/80 bg-slate-950/30 px-6 py-4 text-sm text-slate-400 backdrop-blur-xl">
            Secure admin workspace
          </div>
          <div className="p-6 sm:p-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
