import { Badge } from "@/components/ui/badge";
import { SettingsForm } from "@/components/admin/settings-form";
import { getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getStoreSettings();

  return (
    <div className="space-y-6">
      <div>
        <Badge>Settings</Badge>
        <h1 className="mt-4 text-4xl font-semibold text-slate-950">Настройки компании</h1>
      </div>
      <SettingsForm
        initialData={{
          companyName: settings?.companyName || "",
          phone: settings?.phone || "",
          telegram: settings?.telegram || "",
          address: settings?.address || "",
          heroTitle: settings?.heroTitle || "",
          heroSubtitle: settings?.heroSubtitle || "",
          aboutText: settings?.aboutText || ""
        }}
      />
    </div>
  );
}
