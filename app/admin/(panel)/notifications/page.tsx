import { Badge } from "@/components/ui/badge";
import { NotificationList } from "@/components/admin/notification-list";
import { getNotifications } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const notifications = await getNotifications();

  return (
    <div className="space-y-6">
      <div>
        <Badge>Notifications</Badge>
        <h1 className="mt-4 text-4xl font-semibold admin-heading">Панель уведомлений</h1>
      </div>
      <NotificationList notifications={notifications} />
    </div>
  );
}
