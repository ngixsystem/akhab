"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BASE_PATH } from "@/lib/constants";

type NotificationRow = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
};

export function NotificationList({ notifications }: Readonly<{ notifications: NotificationRow[] }>) {
  const router = useRouter();

  async function markRead(id: string) {
    await fetch(`${BASE_PATH}/api/notifications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isRead: true })
    });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      {notifications.map((notification) => (
        <div key={notification.id} className="card p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="text-lg font-semibold admin-heading">{notification.title}</div>
              <p className="mt-2 text-sm leading-7 admin-muted">{notification.message}</p>
            </div>
            {!notification.isRead ? (
              <Button type="button" variant="secondary" onClick={() => markRead(notification.id)}>
                Mark read
              </Button>
            ) : (
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300">
                read
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
