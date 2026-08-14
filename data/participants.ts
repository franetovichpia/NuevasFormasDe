export type NfdParticipant = {
  number: string;
  name: string;
  role: string | null;
  description: string | null;
  image: string;
  imageAlt: string;
  imagePosition: string;
};

export const nfdParticipants: readonly NfdParticipant[] = [
  {
    number: "01",
    name: "Alguien",
    role: "Comunidad",
    description:
      "Alguien representa a todas las personas que se suman a nuestros eventos. No es una figura pasiva, sino el creador de su propia realidad. Esta figura poética simboliza la comunidad que co-creamos: auténtica, valiente y comprometida con un cambio consciente.",
    image:
      "/images/team/alguien.jpg",
    imageAlt:
      "Representación visual de Alguien",
    imagePosition:
      "object-center",
  },
  {
    number: "02",
    name: "Emiliano Rossotti",
    role: "Co-fundador",
    description:
      "Arquitecto UBA, especialista en arquitectura social y participativa, aprendiz de Permacultura. Co-autor del proyecto Comunidad Barrios Soberanos, un proyecto social y autogestivo que busca co-crear nuevas comunidades en armonía con la naturaleza.",
    image:
      "/images/team/emiliano-rossotti.jpeg",
    imageAlt:
      "Retrato de Emiliano Rossotti",
    imagePosition:
      "object-[center_20%]",
  },
  {
    number: "03",
    name: "La Tejedora",
    role: "Comunidad",
    description: 
      "La Tejedora representa la capacidad de unir personas, ideas y experiencias para crear nuevas posibilidades. A través de la escucha y el encuentro, transforma vínculos individuales en una trama colectiva. Esta figura simbólica expresa una forma de construir en comunidad: sensible, colaborativa y consciente de que cada persona aporta un hilo esencial.",
    image:
      "/images/team/la-tejedora.png",
    imageAlt:
      "Representación visual de La Tejedora",
    imagePosition:
      "object-center",
  },
];