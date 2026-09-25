import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  readSessionToken,
  SESSION_COOKIE,
  type AdminRole,
  type AdminSession,
} from "@/lib/session-token";

export {
  createSessionToken,
  isAuthConfigured,
  SESSION_COOKIE,
  verifyCredentials,
  type AdminRole,
  type AdminSession,
} from "@/lib/session-token";

export async function getSession() {
  const cookieStore = await cookies();

  return readSessionToken(
    cookieStore.get(SESSION_COOKIE)
      ?.value,
  );
}

/**
 * Para páginas del panel: redirige al ingreso si no hay sesión.
 */
export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export function canDeletePermanently(
  session: AdminSession,
) {
  return session.role === "admin";
}

export const roleLabels: Record<
  AdminRole,
  string
> = {
  admin: "Administración",
  editor: "Usuario",
};
