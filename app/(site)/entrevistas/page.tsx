import type { Metadata } from "next";

import { ConversationsArchive } from "@/components/sections/conversations/conversations-archive";
import {
  parseCategoryFilter,
  parsePlatformFilter,
} from "@/lib/conversation-filters";
import { getPublicConversations } from "@/lib/content/repository";

export const metadata: Metadata = {
  title: "Entrevistas | Nuevas Formas De...",
  description:
    "Todas las entrevistas y podcasts de Nuevas Formas De, en YouTube, Instagram y Spotify.",
};

export default async function InterviewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    red?: string | string[];
    categoria?: string | string[];
  }>;
}) {
  const [params, conversations] =
    await Promise.all([
      searchParams,
      getPublicConversations(),
    ]);

  const first = (
    value: string | string[] | undefined,
  ) => (Array.isArray(value) ? value[0] : value);

  return (
    <ConversationsArchive
      conversations={conversations}
      initialCategory={parseCategoryFilter(
        first(params.categoria),
      )}
      initialPlatform={parsePlatformFilter(
        first(params.red),
      )}
    />
  );
}
