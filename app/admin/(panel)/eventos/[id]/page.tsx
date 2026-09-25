import { notFound } from "next/navigation";

import { EventForm } from "@/components/admin/event-form";
import { getCachedAllEvents } from "@/lib/content/repository";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{
    id: string;
  }>;
}) {
  const { id } = await params;
  const events = await getCachedAllEvents();

  const event = events.find(
    (item) => item.id === id,
  );

  if (!event) {
    notFound();
  }

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        Editar evento
      </h1>

      <EventForm event={event} />
    </>
  );
}
