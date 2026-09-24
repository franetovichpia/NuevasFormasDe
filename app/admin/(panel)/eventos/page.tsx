import Link from "next/link";
import { Plus } from "lucide-react";

import { EventList } from "@/components/admin/event-list";
import {
  canDeletePermanently,
  requireSession,
} from "@/lib/auth";
import { getAllEvents } from "@/lib/content/repository";
import {
  getEventDateLabel,
  getEventStatus,
} from "@/lib/events";

export default async function AdminEventsPage() {
  const [session, events] =
    await Promise.all([
      requireSession(),
      getAllEvents(),
    ]);

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            Eventos
          </h1>

          <p className="mt-2 text-sm text-ink/55">
            Solo los eventos publicados se ven en el sitio. Los
            archivados se conservan acá y se pueden restaurar.
          </p>
        </div>

        <Link
          className="admin-button-primary"
          href="/admin/eventos/nuevo"
        >
          <Plus
            aria-hidden="true"
            size={15}
          />
          Nuevo evento
        </Link>
      </div>

      <EventList
        canDelete={canDeletePermanently(
          session,
        )}
        events={events.map((event) => ({
          ...event,
          date: getEventDateLabel(event),
          status: getEventStatus(event),
        }))}
      />
    </>
  );
}
