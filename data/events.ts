export type EventStatus =
  | "upcoming"
  | "past";

export type NfdEvent = {
  slug: string;
  title: string;
  date: string;
  location: string | null;
  status: EventStatus;
  coverImage: string | null;
  gallery: readonly string[];
  href: string | null;
  description: string | null;
};

export const nfdEvents: readonly NfdEvent[] = [
  {
    slug: "proximo-encuentro",
    title: "Próximamente",
    date: "Fecha a confirmar",
    location: null,
    status: "upcoming",
    coverImage: null,
    gallery: [],
    href: null,
    description: null,
  },
  {
    slug: "primera-convencion",
    title: "Primera Convención",
    date: "24 y 25 de mayo de 2025",
    location: "Quinta de Benavidez, Tigre",
    status: "past",
    coverImage: null,
    gallery: [],
    href: null,
    description:
      "NUEVAS FORMAS DE, un encuentro inspirado en alinear y sincronizar nuestras acciones naturales a nuestro diseño humano y divino como promotores de un proceso expansivo de habilidades propias de nuestra especie. Compartiendo e intercambiando saberes, aprendizajes, vivencias y energías enfocadas en materializar aquí y ahora la utopía de vivir felices en libertad. Anhelamos ser generadores y facilitadores de encuentros entre profesionales de diferentes disciplinas, a los que convocamos para investigar, practicar, desarrollar y sostener un nuevo equilibrio natural con nuestro ser, apoyado en una cosmovisión empática, resolutiva y en resonancia con el equilibrio natural de los elementos del universo y su naturaleza cósmica. Buscamos gestar, motivar, acompañar y alentar procesos de búsqueda y encuentro desde lo individual a lo grupal-universal, operar como intermediarios en el descubrimiento de nuevas tecnologías tanto humanas como espirituales y energéticas, donde el eje esté centrado en el ser como una unidad corporal, espiritual, mental, álmica y cósmica. Tales propuestas permitirán fundar lazos bajo un nuevo contexto, en el cual las relaciones humanas decanten en su naturaleza solidaria, creando nodos y focos que alienten y estimulen el valor de la confianza como esencial para el sano desarrollo del entramado social. Incentivar el encuentro nos permite hallar nuestros pares afines, potenciando y ampliando así el desarrollo y aprovechamiento de las habilidades propias de cada individualidad.",
  },
];