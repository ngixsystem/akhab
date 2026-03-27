import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-white/5 p-8 text-white shadow-industrial backdrop-blur">
        <div className="mb-8">
          <div className="text-sm uppercase tracking-[0.24em] text-amber-300">OOO METIKS</div>
          <h1 className="mt-4 text-3xl font-semibold">Admin login</h1>
          <p className="mt-3 text-sm text-slate-300">
            Вход для управления товарами, заказами, остатками и настройками витрины.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
