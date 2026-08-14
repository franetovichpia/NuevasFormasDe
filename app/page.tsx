import { ActivitiesSection } from "@/components/sections/activities-section";
import { ContactSection } from "@/components/sections/contact-section";
import { ConversationsSection } from "@/components/sections/conversations-section";
import { EventsSection } from "@/components/sections/events-section";
import { HeroSection } from "@/components/sections/hero-section";
import { NexoSection } from "@/components/sections/nexo-section";
import { ParticipantsSection } from "@/components/sections/participants-section";
import { ProposalSection } from "@/components/sections/proposal-section";

export default function HomePage() {
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

      <EventsSection />

      <ConversationsSection />

      <NexoSection />

      <ContactSection />
    </main>
  );
}