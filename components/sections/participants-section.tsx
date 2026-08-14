import Image from "next/image";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { 
    nfdParticipants as participants,
} from "@/data/participants";

export function ParticipantsSection() {
  return (
    <section
      aria-labelledby="participants-heading"
      className="relative isolate overflow-hidden bg-nfd-navy text-white"
      id="integrantes"
    >
      {/* Fondos decorativos */}
      <div
        aria-hidden="true"
        className="absolute -left-48 top-20 size-[34rem] rounded-full bg-nfd-cyan/10 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-48 bottom-0 size-[36rem] rounded-full bg-nfd-magenta/10 blur-[9rem]"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        {/* Encabezado */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-nfd-cyan">
                Nuestro equipo
              </p>

              <h2
                className="mt-6 max-w-[10ch] font-sans text-[clamp(2.8rem,5.5vw,5.8rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-white"
                id="participants-heading"
              >
                Quienes forman parte.
              </h2>
            </Reveal>
          </div>

          <div className="flex items-end lg:col-span-7 lg:pl-8">
            <Reveal delay={0.08}>
              <p className="max-w-2xl font-sans text-[clamp(1.15rem,1.8vw,1.75rem)] font-normal leading-relaxed text-white/65">
                Personas y figuras que representan distintas formas de
                encontrarse, crear y construir en comunidad.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Integrantes */}
        <div className="mt-16 grid grid-cols-1 items-stretch gap-5 md:grid-cols-3">
          {participants.map((participant, index) => (
            <Reveal
              className="h-full"
              delay={0.08 + index * 0.08}
              key={participant.name}
            >
              <article className="group flex h-full min-h-[38rem] flex-col overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.055] p-6 text-center backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.08] sm:p-7 lg:min-h-[42rem] lg:p-8">
                {/* Imagen con altura fija */}
                <div className="relative mx-auto size-48 shrink-0 sm:size-52 lg:size-56">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full bg-gradient-to-br from-nfd-cyan via-nfd-blue to-nfd-magenta opacity-75 blur-xl transition-opacity duration-500 group-hover:opacity-100"
                  />

                  <div className="relative size-full overflow-hidden rounded-full border border-white/20 bg-white/10 p-1">
                    <div className="relative size-full overflow-hidden rounded-full">
                      <Image
                        alt={participant.imageAlt}
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.035]"
                        fill
                        sizes="(max-width: 767px) 192px, (max-width: 1023px) 208px, 224px"
                        src={participant.image}
                      />
                    </div>
                  </div>
                </div>

                {/* Contenido alineado */}
                <div className="mt-8 flex flex-1 flex-col items-center">
                  <div
                    aria-hidden="true"
                    className="h-1 w-14 shrink-0 rounded-full bg-gradient-to-r from-nfd-cyan via-nfd-magenta to-nfd-coral"
                  />

                  {/* Altura común para los nombres */}
                  <div className="mt-7 flex min-h-[3.5rem] items-start justify-center">
                    <h3 className="font-sans text-[clamp(1.75rem,2.4vw,2.5rem)] font-semibold leading-tight tracking-[-0.04em] text-white">
                      {participant.name}
                    </h3>
                  </div>

                  {/* El espacio del rol se conserva aunque esté vacío */}
                  <p className="mt-2 min-h-6 text-[0.62rem] font-semibold uppercase tracking-[0.17em] text-nfd-cyan">
                    {participant.role ?? "\u00A0"}
                  </p>

                  {/* Todas las descripciones empiezan a la misma altura */}
                  <p className="mt-5 max-w-md text-sm leading-7 text-white/60 sm:text-[0.95rem] sm:leading-8">
                    {participant.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}