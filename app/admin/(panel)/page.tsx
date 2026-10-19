import Link from "next/link";
import {
  CalendarDays,
  CircleAlert,
  CircleCheck,
  Mic,
} from "lucide-react";

import {
  getAccountStatuses,
  requireSession,
  roleLabels,
} from "@/lib/auth";
import {
  getCachedAllEvents,
  getPublicConversations,
} from "@/lib/content/repository";

export default async function AdminHomePage() {
  const [session, events, conversations] =
    await Promise.all([
      requireSession(),
      getCachedAllEvents(),
      getPublicConversations(),
    ]);

  // Solo la cuenta de administración ve el estado de las cuentas.
  const accounts =
    session.role === "admin"
      ? getAccountStatuses()
      : [];

  const count = (
    visibility: string,
  ) =>
    events.filter(
      (event) =>
        event.visibility === visibility,
    ).length;

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        Panel de contenidos
      </h1>

      <p className="mt-2 text-sm text-ink/55">
        Elegí qué querés administrar. Los cambios se ven en el
        sitio apenas se guardan.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link
          className="admin-card group transition-colors hover:border-nfd-blue/30"
          href="/admin/eventos"
        >
          <CalendarDays
            aria-hidden="true"
            className="text-nfd-blue"
            size={26}
            strokeWidth={1.6}
          />

          <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] group-hover:text-nfd-blue">
            Eventos
          </h2>

          <p className="mt-1 text-sm text-ink/55">
            Cargar, modificar, publicar, archivar o eliminar
            eventos con sus fotos y fechas.
          </p>

          <p className="mt-4 text-xs text-ink/45">
            {count("published")} publicados ·{" "}
            {count("draft")} borradores ·{" "}
            {count("archived")} archivados
          </p>
        </Link>

        <Link
          className="admin-card group transition-colors hover:border-nfd-magenta/30"
          href="/admin/entrevistas"
        >
          <Mic
            aria-hidden="true"
            className="text-nfd-magenta"
            size={26}
            strokeWidth={1.6}
          />

          <h2 className="mt-4 text-xl font-semibold tracking-[-0.03em] group-hover:text-nfd-magenta">
            Entrevistas
          </h2>

          <p className="mt-1 text-sm text-ink/55">
            Subir una planilla de Excel o CSV con las entrevistas
            de YouTube, Instagram y Spotify.
          </p>

          <p className="mt-4 text-xs text-ink/45">
            {conversations.length} entrevistas publicadas
          </p>
        </Link>
      </div>
      {accounts.length > 0 ? (
        <section className="admin-card mt-6">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">
            Cuentas del panel
          </h2>

          <ul className="mt-4 space-y-2 text-sm">
            {accounts.map((account) => (
              <li
                className="flex items-start gap-2"
                key={account.role}
              >
                {account.configured ? (
                  <CircleCheck
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-emerald-600"
                    size={16}
                  />
                ) : (
                  <CircleAlert
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-nfd-coral"
                    size={16}
                  />
                )}

                <span>
                  <strong>{roleLabels[account.role]}</strong>
                  {account.configured ? (
                    <>
                      : activa, ingresa con el usuario{" "}
                      <code className="rounded bg-ink/5 px-1.5 py-0.5">
                        {account.username}
                      </code>
                      .
                    </>
                  ) : (
                    <>
                      : no está activa. Falta cargar{" "}
                      <code className="rounded bg-ink/5 px-1.5 py-0.5">
                        {account.missing}
                      </code>{" "}
                      en Vercel (y volver a publicar).
                    </>
                  )}
                </span>
              </li>
            ))}
          </ul>

          <p className="admin-hint">
            Las contraseñas no se muestran nunca. Si alguien no puede
            entrar con su usuario, cargá de nuevo su contraseña en
            Vercel → Settings → Environment Variables y volvé a
            publicar.
          </p>
        </section>
      ) : null}
    </>
  );
}
