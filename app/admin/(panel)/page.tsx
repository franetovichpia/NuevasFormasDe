import Link from "next/link";
import {
  CalendarDays,
  Mic,
} from "lucide-react";

import {
  getAllConversations,
  getAllEvents,
} from "@/lib/content/repository";

export default async function AdminHomePage() {
  const [events, conversations] =
    await Promise.all([
      getAllEvents(),
      getAllConversations(),
    ]);

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
    </>
  );
}
