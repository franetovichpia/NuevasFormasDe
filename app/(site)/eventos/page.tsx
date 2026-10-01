import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { EventsCalendar } from "@/components/sections/events/events-calendar";
import { Container } from "@/components/ui/container";
import { getPublishedEvents } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Eventos | Nuevas Formas De...",
  description:
    "Todos los encuentros de Nuevas Formas De: próximos y realizados.",
};

// Igual que la portada: se actualiza al guardar desde el panel.
export const revalidate = 300;

export default async function EventsPage() {
  const events = await getPublishedEvents();

  const upcomingCount = events.filter(
    (event) => event.status === "upcoming",
  ).length;

  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-background text-ink">
      <div
        aria-hidden="true"
        className="absolute -left-44 top-10 size-[28rem] rounded-full bg-nfd-cyan/8 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-44 bottom-0 size-[26rem] rounded-full bg-nfd-magenta/7 blur-[9rem]"
      />

      <Container className="relative pb-20 pt-32 sm:pb-24 sm:pt-36">
        <Link
          className="glass-interactive inline-flex min-h-10 items-center gap-2 rounded-full border border-ink/10 bg-white/60 pl-3 pr-4 text-[0.6rem] font-semibold uppercase tracking-[0.13em] text-ink/60 backdrop-blur-xl hover:border-nfd-blue/35 hover:text-nfd-blue"
          href="/#eventos"
        >
          <ArrowLeft
            aria-hidden="true"
            size={16}
            strokeWidth={1.7}
          />
          Volver
        </Link>

        <div className="mt-8 border-b border-ink/10 pb-8">
          <p className="text-[0.59rem] font-semibold uppercase tracking-[0.19em] text-nfd-magenta">
            Agenda y archivo
          </p>

          <h1 className="mt-4 font-sans text-[clamp(2.4rem,4.6vw,4.8rem)] font-semibold leading-[0.92] tracking-[-0.055em]">
            Todos los eventos.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/55">
            {events.length}{" "}
            {events.length === 1
              ? "encuentro"
              : "encuentros"}
            {upcomingCount > 0
              ? `, ${upcomingCount} por venir`
              : ""}
            . Elegí uno para verlo en el calendario o tocá la
            flecha para ver el detalle.
          </p>
        </div>

        <EventsCalendar events={events} />
      </Container>
    </main>
  );
}
