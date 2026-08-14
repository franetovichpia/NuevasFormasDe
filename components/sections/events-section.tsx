import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  Clock3,
  MapPin,
} from "lucide-react";

import { EventGallery } from "@/components/sections/events/event-gallery";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import {
  nfdEvents,
  type NfdEvent,
} from "@/data/events";

type EventCardProps = {
  event: NfdEvent;
};

function EventCard({
  event,
}: EventCardProps) {
  const isUpcoming =
    event.status === "upcoming";

  return (
    <article className="group/card grid overflow-hidden rounded-[1.4rem] border border-ink/10 bg-white/55 shadow-[0_1.25rem_3rem_rgb(28_42_54/0.1)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-0.5 hover:border-nfd-blue/20 hover:bg-white/75 md:grid-cols-[12rem_1fr]">
      {/* Portada */}
      <div className="relative min-h-40 overflow-hidden bg-nfd-navy md:min-h-full">
        {event.coverImage ? (
          <Image
            alt={`Portada de ${event.title}`}
            className="object-cover transition-transform duration-700 group-hover/card:scale-[1.03]"
            fill
            loading="lazy"
            sizes="(max-width: 768px) 100vw, 12rem"
            src={event.coverImage}
          />
        ) : (
          <>
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 300 300"
            >
              <path
                d="M-45 229C39 204 80 93 170 112C237 126 252 207 347 170"
                opacity="0.75"
                stroke="#00a5c5"
                strokeLinecap="round"
                strokeWidth="14"
              />

              <path
                d="M-40 257C54 232 94 149 185 158C254 166 280 243 348 213"
                opacity="0.75"
                stroke="#b6005b"
                strokeLinecap="round"
                strokeWidth="20"
              />

              <path
                d="M-30 279C65 262 111 194 203 201C264 207 298 267 352 246"
                opacity="0.8"
                stroke="#ee4037"
                strokeLinecap="round"
                strokeWidth="7"
              />
            </svg>

            <div className="absolute inset-0 grid place-items-center">
              <span className="grid size-12 place-items-center rounded-full border border-white/15 bg-white/10 text-white shadow-lg backdrop-blur-xl">
                {isUpcoming ? (
                  <Clock3
                    aria-hidden="true"
                    size={21}
                    strokeWidth={1.5}
                  />
                ) : (
                  <Calendar
                    aria-hidden="true"
                    size={21}
                    strokeWidth={1.5}
                  />
                )}
              </span>
            </div>
          </>
        )}

        <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-nfd-navy/75 px-3 py-1.5 text-[0.5rem] font-semibold uppercase tracking-[0.13em] text-white backdrop-blur-xl">
          {isUpcoming
            ? "Próximo evento"
            : "Evento realizado"}
        </span>
      </div>

      {/* Información */}
      <div className="flex min-w-0 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.55rem] font-semibold uppercase tracking-[0.13em] text-ink/45">
          <span className="inline-flex items-center gap-2">
            <Calendar
              aria-hidden="true"
              className="text-nfd-blue"
              size={14}
              strokeWidth={1.6}
            />

            {event.date}
          </span>

          {event.location ? (
            <span className="inline-flex items-center gap-2">
              <MapPin
                aria-hidden="true"
                className="text-nfd-magenta"
                size={14}
                strokeWidth={1.6}
              />

              {event.location}
            </span>
          ) : null}
        </div>

        <h3 className="mt-4 font-sans text-[1.5rem] font-semibold leading-tight tracking-[-0.04em] text-ink sm:text-[1.75rem]">
          {event.title}
        </h3>

        {isUpcoming ? (
          <p className="mt-3 max-w-xl text-sm leading-7 text-ink/50">
            La información del próximo encuentro será publicada cuando
            estén confirmados sus datos.
          </p>
        ) : null}

        {event.description ? (
          <details className="group mt-5 border-t border-ink/10 pt-4">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-xl marker:hidden [&::-webkit-details-marker]:hidden">
              <span className="text-[0.55rem] font-semibold uppercase tracking-[0.14em] text-nfd-blue">
                Leer propuesta completa
              </span>

              <span className="grid size-8 place-items-center rounded-full border border-ink/10 bg-white/60 text-nfd-blue transition-all duration-300 group-open:bg-nfd-blue group-open:text-white">
                <ChevronDown
                  aria-hidden="true"
                  className="transition-transform duration-300 group-open:rotate-180"
                  size={15}
                  strokeWidth={1.6}
                />
              </span>
            </summary>

            <div className="mt-4 rounded-[1.1rem] border border-ink/10 bg-[#f4efe6]/75 p-5 backdrop-blur-xl sm:p-6">
              <p className="text-sm leading-8 text-ink/65 sm:text-[0.95rem]">
                {event.description}
              </p>
            </div>
          </details>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
          {event.href ? (
            <a
              aria-label={`Conocer el evento ${event.title}`}
              className="inline-flex min-h-9 items-center gap-2 rounded-full bg-nfd-blue px-4 text-[0.53rem] font-semibold uppercase tracking-[0.13em] text-white transition-colors duration-300 hover:bg-nfd-navy"
              href={event.href}
              rel="noreferrer"
              target="_blank"
            >
              Conocer evento

              <ArrowUpRight
                aria-hidden="true"
                size={13}
                strokeWidth={1.6}
              />
            </a>
          ) : null}

          {!isUpcoming ? (
            event.gallery.length > 0 ? (
              <EventGallery
                eventTitle={event.title}
                images={event.gallery}
              />
            ) : (
              <span className="inline-flex min-h-9 items-center rounded-full border border-ink/10 bg-white/35 px-4 text-[0.52rem] font-semibold uppercase tracking-[0.12em] text-ink/35">
                Fotos pendientes
              </span>
            )
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function EventsSection() {
  const upcomingEvents = nfdEvents.filter(
    (event) =>
      event.status === "upcoming",
  );

  const pastEvents = nfdEvents.filter(
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
                Agenda y archivo
              </p>

              <h2
                className="mt-4 font-sans text-[clamp(2.4rem,4vw,4.5rem)] font-semibold leading-[0.92] tracking-[-0.055em] text-ink"
                id="events-heading"
              >
                Eventos.
              </h2>
            </Reveal>
          </div>

          <div className="lg:col-span-5 lg:text-right">
            <Reveal delay={0.08}>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <span className="rounded-full border border-ink/10 bg-white/40 px-4 py-2 text-[0.53rem] font-semibold uppercase tracking-[0.13em] text-ink/45 backdrop-blur-xl">
                  {upcomingEvents.length} próximos
                </span>

                <span className="rounded-full border border-ink/10 bg-white/40 px-4 py-2 text-[0.53rem] font-semibold uppercase tracking-[0.13em] text-ink/45 backdrop-blur-xl">
                  {pastEvents.length} realizados
                </span>
              </div>
            </Reveal>
          </div>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="mt-8">
            <Reveal>
              <p className="mb-4 text-[0.57rem] font-semibold uppercase tracking-[0.16em] text-nfd-blue">
                Próximos encuentros
              </p>
            </Reveal>

            <div className="space-y-4">
              {upcomingEvents.map(
                (event, index) => (
                  <Reveal
                    delay={
                      0.05 +
                      index * 0.05
                    }
                    key={event.slug}
                  >
                    <EventCard
                      event={event}
                    />
                  </Reveal>
                ),
              )}
            </div>
          </div>
        ) : null}

        {pastEvents.length > 0 ? (
          <div
            className={
              upcomingEvents.length > 0
                ? "mt-10"
                : "mt-8"
            }
          >
            <Reveal>
              <p className="mb-4 text-[0.57rem] font-semibold uppercase tracking-[0.16em] text-ink/40">
                Eventos realizados
              </p>
            </Reveal>

            <div className="space-y-4">
              {pastEvents.map(
                (event, index) => (
                  <Reveal
                    delay={
                      0.05 +
                      index * 0.05
                    }
                    key={event.slug}
                  >
                    <EventCard
                      event={event}
                    />
                  </Reveal>
                ),
              )}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}