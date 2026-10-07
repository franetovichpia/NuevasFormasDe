import { ActivitiesSection } from "@/components/sections/activities-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ConversationsSection } from "@/components/sections/conversations-section";
import { EventsSection } from "@/components/sections/events-section";
import { HeroSection } from "@/components/sections/hero-section";
import { NexoSection } from "@/components/sections/nexo-section";
import { ParticipantsSection } from "@/components/sections/participants-section";
import { ProposalSection } from "@/components/sections/proposal-section";
import { ValuesSection } from "@/components/sections/values-section";
import {
  getInterviewsFilterConfig,
  getPublicConversations,
  getPublishedEvents,
} from "@/lib/content/repository";

// El contenido editable se actualiza al guardar desde el panel;
// además se revisa cada 5 minutos (por ejemplo, para pasar
// eventos de "próximos" a "realizados").
export const revalidate = 300;

export default async function HomePage() {
  const [events, conversations, filterConfig] =
    await Promise.all([
      getPublishedEvents(),
      getPublicConversations(),
      getInterviewsFilterConfig(),
    ]);

  return (
    <main>
      {/* 1. Portada */}
      <HeroSection />

      {/* 2. Quiénes somos */}
      <div
        className="scroll-mt-28"
        id="quienes-participan"
      >
        <ParticipantsSection />
      </div>

      {/* 3. Invitación a participar: calendario de eventos */}
      <EventsSection events={events} />

      <ActivitiesSection />

      {/* 4. De qué se trata, entrevistas y lo que nos guía */}
      <ProposalSection />

      <ConversationsSection
        conversations={conversations}
        filterConfig={filterConfig}
      />

      <ValuesSection />

      <NexoSection />

      <ContactSection />
    </main>
  );
}
