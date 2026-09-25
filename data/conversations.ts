import type { ConversationCategory } from "@/data/categories";

export type ConversationPlatform =
  | "instagram"
  | "youtube"
  | "podcast";

export type ConversationMedia = {
  platform: ConversationPlatform;
  image: string;
  href: string;
};

export type Conversation = {
  slug: string;
  title: string;
  guest?: string;
  date?: string;
  description?: string;
  categories?: readonly ConversationCategory[];
  media: readonly ConversationMedia[];
};

export const conversationChannels = {
  instagram:
    "https://www.instagram.com/nuevas.formas.de",
  youtube:
    "https://www.youtube.com/@NuevasFormasDe",
  podcast:
    "https://open.spotify.com/show/033PE3rHRNbHlga66ADR7H",
} as const;

/**
 * Contenido inicial. Una vez que se importa un CSV/Excel
 * desde el panel, el sitio usa lo guardado en el almacenamiento.
 */
export const conversations: readonly Conversation[] = [
  {
    slug: "la-reconquista",
    title: "La Reconquista",
    guest: "Guillermo Andreau",
    date: "13 de agosto de 2026",
    media: [
      {
        platform: "instagram",
        image:
          "/images/conversations/instagram/la-reconquista.png",
        href: conversationChannels.instagram,
      },
    ],
  },
  {
    slug: "patrones-en-resonancia",
    title: "Patrones en Resonancia",
    guest: "Gabriela Mirabai",
    date: "3 de julio de 2026",
    media: [
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/patrones-en-resonancia.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "darte-credito",
    title: "Recuerda siempre, darte crédito",
    media: [
      {
        platform: "podcast",
        image:
          "/images/conversations/podcast/darte-credito.png",
        href: conversationChannels.podcast,
      },
    ],
  },
  {
    slug: "nuestra-argentinidad",
    title: "Nuestra Argentinidad",
    guest: "Carolina De Los Angeles",
    date: "5 de agosto de 2026",
    media: [
      {
        platform: "instagram",
        image:
          "/images/conversations/instagram/nuestra-argentinidad.png",
        href: conversationChannels.instagram,
      },
    ],
  },
  {
    slug: "desde-mi-experiencia",
    title: "Desde mi Experiencia",
    guest: "Sandra Espinosa",
    date: "1 de julio de 2026",
    media: [
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/desde-mi-experiencia.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "un-largo-camino",
    title: "Cómo abordar un largo camino",
    media: [
      {
        platform: "podcast",
        image:
          "/images/conversations/podcast/un-largo-camino.png",
        href: conversationChannels.podcast,
      },
    ],
  },
  {
    slug: "contar-la-cruda-verdad",
    title: "Contar la cruda verdad que nos ocultan",
    guest: "Natalia Alejandra Gonzalez",
    date: "23 de junio de 2026",
    media: [
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/contar-la-cruda-verdad.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "territorios-de-integracion",
    title: "Territorios de Integración",
    guest: "Pedro Moreno",
    date: "29 de julio de 2026",
    media: [
      {
        platform: "instagram",
        image:
          "/images/conversations/instagram/territorios-de-integracion.png",
        href: conversationChannels.instagram,
      },
    ],
  },
  {
    slug: "sutilezas-del-alma",
    title: "Sutilezas del Alma",
    guest: "Carlos Emilio Amigo",
    date: "21 de mayo de 2026",
    media: [
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/sutilezas-del-alma.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "si-pudiera",
    title: "Lo haría si pudiera…",
    media: [
      {
        platform: "podcast",
        image:
          "/images/conversations/podcast/si-pudiera.png",
        href: conversationChannels.podcast,
      },
    ],
  },
  {
    slug: "alas-para-volar",
    title: "Alas para Volar",
    guest: "Fernanda Karlen",
    date: "1 de mayo de 2026",
    media: [
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/alas-para-volar.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "sistema-psicopatico",
    title:
      "Sistema Psicopático: miedo, manipulación y crueldad",
    guest: "Sebastian Miraglia",
    media: [
      {
        platform: "instagram",
        image:
          "/images/conversations/instagram/sistema-psicopatico.png",
        href: conversationChannels.instagram,
      },
    ],
  },
  {
    slug: "el-fluir-de-la-magia",
    title: "El fluir de la magia en público",
    guest: "Mago Marruen",
    media: [
      {
        platform: "instagram",
        image:
          "/images/conversations/instagram/el-fluir-de-la-magia.png",
        href: conversationChannels.instagram,
      },
    ],
  },
  {
    slug: "expectativas",
    title: "Lápiz sobre papel: expectativas…",
    media: [
      {
        platform: "podcast",
        image:
          "/images/conversations/podcast/expectativas.png",
        href: conversationChannels.podcast,
      },
    ],
  },
  {
    slug: "explorar-y-crear-nuevos-mundos",
    title: "Explorar y crear nuevos mundos",
    guest: "Jonathan Descubre",
    media: [
      {
        platform: "instagram",
        image:
          "/images/conversations/instagram/explorar-y-crear-nuevos-mundos.png",
        href: conversationChannels.instagram,
      },
    ],
  },
  {
    slug: "somos-energia-consciente",
    title: "Somos Energía Consciente",
    guest:
      "Claudia Gonzalez De Vicenzo y Roxana Colabufo",
    date: "9 de mayo de 2025",
    media: [
      {
        platform: "instagram",
        image:
          "/images/conversations/instagram/somos-energia-consciente.png",
        href: conversationChannels.instagram,
      },
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/somos-energia-consciente.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "camino-de-vida",
    title: "Camino de Vida",
    guest: "Fernando Olivieri",
    date: "8 de julio de 2025",
    media: [
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/camino-de-vida.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "accionarte",
    title:
      "Accionarte, la frecuencia de la acción consciente",
    guest: "Roxana Colabufo",
    date: "6 de junio de 2025",
    media: [
      {
        platform: "instagram",
        image:
          "/images/conversations/instagram/accionarte.png",
        href: conversationChannels.instagram,
      },
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/accionarte.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "el-velero",
    title: "De tu vida: el velero…",
    media: [
      {
        platform: "podcast",
        image:
          "/images/conversations/podcast/el-velero.png",
        href: conversationChannels.podcast,
      },
    ],
  },
  {
    slug: "eclipse-de-luna",
    title: "Eclipse de Luna",
    guest: "Maximiliano Buzzo",
    media: [
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/eclipse-de-luna.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "creer-o-saber",
    title: "Creer o Saber",
    guest: "Luis Carlos Schweitzer",
    media: [
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/creer-o-saber.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "arquitectura-del-poder",
    title: "Arquitectura del Poder",
    guest: "Unión por el Bienestar",
    media: [
      {
        platform: "instagram",
        image:
          "/images/conversations/instagram/arquitectura-del-poder.png",
        href: conversationChannels.instagram,
      },
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/arquitectura-del-poder.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "barrios-soberanos",
    title: "Barrios Soberanos",
    guest: "Marcos Kappes",
    media: [
      {
        platform: "instagram",
        image:
          "/images/conversations/instagram/barrios-soberanos.png",
        href: conversationChannels.instagram,
      },
      {
        platform: "youtube",
        image:
          "/images/conversations/youtube/barrios-soberanos.png",
        href: conversationChannels.youtube,
      },
    ],
  },
  {
    slug: "privatizaron-el-ingles",
    title: "Privatizaron el inglés",
    media: [
      {
        platform: "podcast",
        image:
          "/images/conversations/podcast/privatizaron-el-ingles.png",
        href: conversationChannels.podcast,
      },
    ],
  },
];