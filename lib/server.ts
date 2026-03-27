import { redirect } from "next/navigation";
import { getSession } from "./auth";
import { BASE_PATH } from "./constants";

export async function requireAdminPage() {
  const session = await getSession();
  if (!session) {
    redirect(`${BASE_PATH}/admin/login`);
  }
  return session;
}
