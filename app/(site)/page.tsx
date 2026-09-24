import { ActivitiesSection } from "@/components/sections/activities-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ConversationsSection } from "@/components/sections/conversations-section";
import { EventsSection } from "@/components/sections/events-section";
import { HeroSection } from "@/components/sections/hero-section";
import { NexoSection } from "@/components/sections/nexo-section";
import { ParticipantsSection } from "@/components/sections/participants-section";
import { ProposalSection } from "@/components/sections/proposal-section";
import {
  getPublicConversations,
  getPublishedEvents,
} from "@/lib/content/repository";

// El contenido editable se actualiza al guardar desde el panel;
// además se revisa cada 5 minutos (por ejemplo, para pasar
// eventos de "próximos" a "realizados").
export const revalidate = 300;

export default async function HomePage() {
  const [events, conversations] =
    await Promise.all([
      getPublishedEvents(),
      getPublicConversations(),
    ]);

  return (
    <main>
      <HeroSection />

      <ProposalSection />

      <div
        className="scroll-mt-28"
        id="quienes-participan"
      >
        <ParticipantsSection />
      </div>

      <ActivitiesSection />

      <EventsSection events={events} />

      <ConversationsSection
        conversations={conversations}
      />

      <NexoSection />

      <ContactSection />
    </main>
  );
}
