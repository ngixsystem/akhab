import { LoginForm } from "@/components/admin/login-form";

export default function AdminLoginPage() {
  return (
    <div className="admin-auth flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.18),_transparent_35%),linear-gradient(180deg,_#020617_0%,_#0f172a_100%)] p-6">
      <div className="w-full max-w-md rounded-[32px] border border-slate-700/60 bg-slate-950/70 p-8 text-white shadow-[0_30px_90px_rgba(2,6,23,0.45)] backdrop-blur-xl">
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
