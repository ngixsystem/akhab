import { loginSchema } from "@/lib/validations";
import { apiError, apiOk } from "@/lib/api";
import { authenticateAdmin, setAuthCookie, signAdminToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) return apiError(parsed.error.issues[0]?.message || "Invalid payload.");

    const admin = await authenticateAdmin(parsed.data.email, parsed.data.password);
    if (!admin) return apiError("Неверный email или пароль.", 401);

    const token = signAdminToken({
      sub: admin.id,
      email: admin.email
    });
    await setAuthCookie(token);

    return apiOk({ admin });
  } catch {
    return apiError("Login failed.", 500);
  }
}
