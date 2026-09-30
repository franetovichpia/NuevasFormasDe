import {
  NextResponse,
  type NextRequest,
} from "next/server";

import {
  readSessionToken,
  SESSION_COOKIE,
} from "@/lib/session-token";

/**
 * Protege el panel antes de que se cargue cualquier página:
 * sin una sesión válida, /admin/* redirige al ingreso y
 * /api/admin/* responde 401. Las páginas y las acciones del
 * servidor vuelven a verificar la sesión por su cuenta.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = readSessionToken(
    request.cookies.get(SESSION_COOKIE)?.value,
  );

  if (pathname === "/admin/login") {
    // Con sesión activa no tiene sentido volver a ingresar.
    return session
      ? NextResponse.redirect(
          new URL("/admin", request.url),
        )
      : NextResponse.next();
  }

  if (session) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json(
      {
        error:
          "La sesión expiró. Volvé a ingresar.",
      },
      {
        status: 401,
      },
    );
  }

  return NextResponse.redirect(
    new URL("/admin/login", request.url),
  );
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
  ],
};
