import { Reveal } from "@/components/motion/reveal";
import { EventsCalendar } from "@/components/sections/events/events-calendar";
import { Container } from "@/components/ui/container";
import type { NfdEvent } from "@/data/events";

// Eventos que se ven en la portada; el resto, en /eventos.
const HOME_VISIBLE_EVENTS = 4;

type EventsSectionProps = {
  events: readonly NfdEvent[];
};

export function EventsSection({
  events,
}: EventsSectionProps) {
  const upcomingEvents = events.filter(
    (event) =>
      event.status === "upcoming",
  );

  const pastEvents = events.filter(
    (event) =>
      event.status === "past",
  );

  return (
    <section
      aria-labelledby="events-heading"
      className="relative isolate scroll-mt-28 overflow-hidden bg-background text-ink"
      id="eventos"
    >
      <div
        aria-hidden="true"
        className="absolute -left-44 top-0 size-[28rem] rounded-full bg-nfd-cyan/8 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-44 bottom-0 size-[26rem] rounded-full bg-nfd-magenta/7 blur-[9rem]"
      />

      <Container className="relative py-14 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-7 border-b border-ink/10 pb-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="text-[0.59rem] font-semibold uppercase tracking-[0.19em] text-nfd-magenta">
                Te invitamos
              </p>

              <h2
                className="mt-4 font-sans text-[clamp(2.4rem,4vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-ink"
                id="events-heading"
              >
                Sumate a un encuentro.
              </h2>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink/60">
                Elegí una fecha en el calendario y conocé cada
                actividad: qué proponemos, dónde y cuándo. Vení a
                compartir, aprender y conSOLidar JUNTOS lo que sí
                queremos.
              </p>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:text-right">
            <Reveal delay={0.08}>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <span className="rounded-full border border-ink/10 bg-white/40 px-4 py-2 text-[0.53rem] font-semibold uppercase tracking-[0.13em] text-ink/45 backdrop-blur-xl">
                  {upcomingEvents.length}{" "}
                  {upcomingEvents.length === 1
                    ? "próximo"
                    : "próximos"}
                </span>

                <span className="rounded-full border border-ink/10 bg-white/40 px-4 py-2 text-[0.53rem] font-semibold uppercase tracking-[0.13em] text-ink/45 backdrop-blur-xl">
                  {pastEvents.length}{" "}
                  {pastEvents.length === 1
                    ? "realizado"
                    : "realizados"}
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        <EventsCalendar
          events={events}
          maxVisible={HOME_VISIBLE_EVENTS}
        />
      </Container>
    </section>
  );
}
