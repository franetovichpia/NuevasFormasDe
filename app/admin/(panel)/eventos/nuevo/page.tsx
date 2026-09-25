import { EventForm } from "@/components/admin/event-form";

export default function NewEventPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        Nuevo evento
      </h1>

      <EventForm event={null} />
    </>
  );
}
