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
      <main className="container-shell py-10 sm:py-14">
        <Badge className="border-blue-500/20 bg-blue-500/10 text-blue-100">Checkout</Badge>
        <h1 className="mt-5 max-w-3xl text-5xl leading-none text-white sm:text-6xl">Оформление заявки</h1>
        <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-lg">
          После отправки заявка появится в административной панели со статусом <strong>new</strong>. Менеджер увидит её сразу.
        </p>
        <div className="mt-8 sm:mt-10">
          <CheckoutForm />
        </div>
      </main>
      <SiteFooter settings={settings} />
    </div>
  );
}
