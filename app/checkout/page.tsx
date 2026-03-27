import { SiteFooter } from "@/components/storefront/site-footer";
import { SiteHeader } from "@/components/storefront/site-header";
import { Badge } from "@/components/ui/badge";
import { CheckoutForm } from "@/components/storefront/checkout-form";
import { getStoreSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const settings = await getStoreSettings();

  return (
    <div>
      <SiteHeader />
      <main className="container-shell py-14">
        <Badge>Checkout</Badge>
        <h1 className="mt-5 text-4xl font-semibold text-slate-950">Оформление заказа</h1>
        <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">
          После отправки заказ появится в административной панели в статусе <strong>new</strong>.
        </p>
        <div className="mt-10">
          <CheckoutForm />
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
