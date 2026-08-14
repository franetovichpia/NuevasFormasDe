import {
  ArrowUpRight,
  Video,
} from "lucide-react";
import { FaInstagram } from "react-icons/fa";

import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/container";
import { nfdLinks } from "@/data/nfd-links";

const activities = [
  {
    number: "01",
    eyebrow: "Sala virtual",
    title: "Nexo Azul",
    action: "Ingresar a la sala",
    href: nfdLinks.virtualRoom,
    icon: Video,
    accent:
      "border-nfd-blue/20 bg-nfd-blue/5 text-nfd-blue",
    line: "bg-nfd-blue",
  },
  {
    number: "02",
    eyebrow: "Instagram",
    title: "Novedades",
    action: "Ver novedades",
    href: nfdLinks.instagram,
    icon: FaInstagram,
    accent:
      "border-nfd-magenta/20 bg-nfd-magenta/5 text-nfd-magenta",
    line: "bg-nfd-magenta",
  },
] as const;

export function ActivitiesSection() {
  return (
    <section
      aria-labelledby="activities-heading"
      className="relative overflow-hidden bg-paper text-ink"
      id="actividades"
    >
      <div
        aria-hidden="true"
        className="absolute -left-40 top-0 size-[30rem] rounded-full bg-nfd-cyan/8 blur-[9rem]"
      />

      <div
        aria-hidden="true"
        className="absolute -right-40 bottom-0 size-[28rem] rounded-full bg-nfd-magenta/8 blur-[9rem]"
      />

      <Container className="relative py-24 sm:py-28 lg:py-36">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-nfd-magenta">
                Información disponible
              </p>

              <h2
                className="mt-6 max-w-[10ch] font-sans text-[clamp(2.8rem,5.8vw,6rem)] font-semibold leading-[0.9] tracking-[-0.055em] text-ink"
                id="activities-heading"
              >
                Actividades y accesos.
              </h2>
            </Reveal>
          </div>

          <div className="flex items-end lg:col-span-7 lg:pl-8">
            <Reveal delay={0.08}>
              <p className="max-w-2xl font-sans text-[clamp(1.15rem,1.9vw,1.8rem)] font-normal leading-relaxed text-ink/65">
                Enfocando nuestra Energía en CoCrear JUNTOS...
                <span className="font-semibold text-nfd-magenta">
                  {" "}
                  #LOQUESI
                </span>
                ... Queremos.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2">
          {activities.map(
            (activity, index) => {
              const Icon = activity.icon;

              return (
                <Reveal
                  className="h-full"
                  delay={
                    0.08 +
                    index * 0.07
                  }
                  key={activity.title}
                >
                  <a
                    aria-label={`${activity.action}: ${activity.title}`}
                    className="glass-surface glass-interactive group flex h-full min-h-[17rem] flex-col rounded-[1.5rem] p-6 sm:p-7"
                    href={activity.href}
                    rel="noreferrer"
                    target="_blank"
                  >
                    <div className="flex items-start justify-between">
                      <span
                        className={`grid size-11 place-items-center rounded-full border ${activity.accent}`}
                      >
                        <Icon
                          aria-hidden="true"
                          size={19}
                        />
                      </span>

                      <span className="text-[0.58rem] font-medium tracking-[0.16em] text-ink/30">
                        {activity.number}
                      </span>
                    </div>

                    <div className="mt-auto pt-12">
                      <div
                        aria-hidden="true"
                        className={`mb-5 h-1 w-14 rounded-full ${activity.line}`}
                      />

                      <p className="text-[0.59rem] font-semibold uppercase tracking-[0.17em] text-ink/45">
                        {activity.eyebrow}
                      </p>

                      <h3 className="mt-3 font-sans text-2xl font-semibold leading-tight tracking-[-0.035em] text-ink">
                        {activity.title}
                      </h3>

                      <div className="mt-6 flex items-center justify-between border-t border-ink/10 pt-5">
                        <span className="text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-ink/55">
                          {activity.action}
                        </span>

                        <ArrowUpRight
                          aria-hidden="true"
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          size={16}
                          strokeWidth={1.6}
                        />
                      </div>
                    </div>
                  </a>
                </Reveal>
              );
            },
          )}
        </div>
      </Container>
    </section>
  );
}