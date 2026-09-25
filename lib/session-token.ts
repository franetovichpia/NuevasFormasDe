import {
  createHmac,
  timingSafeEqual,
} from "node:crypto";

/**
 * Cuentas y firma de la sesión del panel. No depende de Next.js, así que
 * se puede usar tanto en páginas y acciones como en `proxy.ts`.
 *
 * Acceso al panel. Hay dos cuentas configuradas por variables de entorno:
 *
 * - Administración (NFD_ADMIN_USER / NFD_ADMIN_PASSWORD): acceso completo,
 *   incluida la eliminación definitiva de eventos.
 * - Usuario (NFD_EDITOR_USER / NFD_EDITOR_PASSWORD): carga, modifica,
 *   publica y archiva eventos e importa entrevistas.
 *
 * La sesión se guarda en una cookie firmada con NFD_SESSION_SECRET.
 */

export type AdminRole =
  | "admin"
  | "editor";

export type AdminSession = {
  username: string;
  role: AdminRole;
  expiresAt: number;
};

export const SESSION_COOKIE =
  "nfd_admin_session";

const SESSION_DURATION_MS =
  1000 * 60 * 60 * 24 * 7;

type Account = {
  username: string;
  password: string;
  role: AdminRole;
};

function getAccounts(): Account[] {
  const accounts: Account[] = [];

  const adminPassword =
    process.env.NFD_ADMIN_PASSWORD;

  const editorPassword =
    process.env.NFD_EDITOR_PASSWORD;

  if (adminPassword) {
    accounts.push({
      username: (
        process.env.NFD_ADMIN_USER ??
        "admin"
      )
        .trim()
        .toLowerCase(),
      password: adminPassword,
      role: "admin",
    });
  }

  if (editorPassword) {
    accounts.push({
      username: (
        process.env.NFD_EDITOR_USER ??
        "emiliano"
      )
        .trim()
        .toLowerCase(),
      password: editorPassword,
      role: "editor",
    });
  }

  return accounts;
}

function getSessionSecret() {
  const secret =
    process.env.NFD_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    return null;
  }

  return secret;
}

export function isAuthConfigured() {
  return (
    getSessionSecret() !== null &&
    getAccounts().length > 0
  );
}

function safeEqual(
  first: string,
  second: string,
) {
  // Se comparan los HMAC para que ambos tengan la misma longitud.
  const key = "nfd-compare";

  return timingSafeEqual(
    createHmac("sha256", key)
      .update(first)
      .digest(),
    createHmac("sha256", key)
      .update(second)
      .digest(),
  );
}

export function verifyCredentials(
  username: string,
  password: string,
): Account | null {
  const normalizedUsername = username
    .trim()
    .toLowerCase();

  let match: Account | null = null;

  // Se recorren todas las cuentas para no revelar cuál existe.
  for (const account of getAccounts()) {
    const usernameMatches = safeEqual(
      account.username,
      normalizedUsername,
    );

    const passwordMatches = safeEqual(
      account.password,
      password,
    );

    if (
      usernameMatches &&
      passwordMatches
    ) {
      match = account;
    }
  }

  return match;
}

function sign(
  payload: string,
  secret: string,
) {
  return createHmac("sha256", secret)
    .update(payload)
    .digest("base64url");
}

export function createSessionToken(
  account: Pick<
    Account,
    "username" | "role"
  >,
) {
  const secret = getSessionSecret();

  if (!secret) {
    throw new Error(
      "Falta configurar NFD_SESSION_SECRET.",
    );
  }

  const session: AdminSession = {
    username: account.username,
    role: account.role,
    expiresAt:
      Date.now() + SESSION_DURATION_MS,
  };

  const payload = Buffer.from(
    JSON.stringify(session),
  ).toString("base64url");

  return {
    token: `${payload}.${sign(payload, secret)}`,
    expiresAt: new Date(
      session.expiresAt,
    ),
  };
}

export function readSessionToken(
  token: string | undefined,
): AdminSession | null {
  const secret = getSessionSecret();

  if (!token || !secret) {
    return null;
  }

  const [payload, signature] =
    token.split(".");

  if (
    !payload ||
    !signature ||
    !safeEqual(
      sign(payload, secret),
      signature,
    )
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(
        payload,
        "base64url",
      ).toString("utf8"),
    ) as AdminSession;

    if (session.expiresAt < Date.now()) {
      return null;
    }

    // La cuenta tiene que seguir existiendo con el mismo rol.
    const accountStillExists =
      getAccounts().some(
        (account) =>
          account.username ===
            session.username &&
          account.role === session.role,
      );

    return accountStillExists
      ? session
      : null;
  } catch {
    return null;
  }
}

