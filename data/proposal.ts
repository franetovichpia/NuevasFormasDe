export type ProposalCard = {
  number: string;
  label: string;
  text: string;
  tone: "blue" | "magenta";
};

export type ThematicArea = {
  number: string;
  label: string;
  description: string;
  tags: readonly string[];
};

const thematicTags = [
  "Innovación",
  "Autonomía",
  "Comunidad",
] as const;

export const proposalStatement =
  "Creemos en un mundo donde las personas son protagonistas de sus propias soluciones y donde la innovación nace desde las comunidades.";

export const proposalCards: readonly ProposalCard[] = [
  {
    number: "01",
    label: "Visión",
    text:
      "Un mundo donde cada persona pueda participar activamente en la creación de soluciones a los desafíos globales desde lo local.",
    tone: "blue",
  },
  {
    number: "02",
    label: "Misión",
    text:
      "Inspirar, conectar y empoderar a las personas para crear nuevas formas de vivir más saludables, conscientes y sostenibles.",
    tone: "magenta",
  },
];

export const proposalValues: readonly string[] = [
  "Autonomía",
  "Colaboración",
  "Innovación",
  "Diversidad",
  "Bien común",
  "Regeneración",
];

export const thematicAreas: readonly ThematicArea[] = [
  {
    number: "01",
    label: "Salud",
    description:
      "Alentamos y promovemos un enfoque de salud integral, articulando e integrando los mejores saberes ancestrales con los más actuales y avanzados descubrimientos científicos, enfocándonos en el bienestar de las personas y de las comunidades. Impulsamos una medicina de calidad, que incorpora desde el inicio el aprendizaje sobre la prevención y los hábitos, así como la participación activa, permitiendo alcanzar soluciones para cada realidad individual.",
    tags: thematicTags,
  },
  {
    number: "02",
    label: "Nutrición",
    description:
      "Fomentamos sistemas alimentarios sustentables basados en principios agroecológicos, integrándolos al sistema de salud preventiva, respetando la biodiversidad e impulsando especialmente la soberanía alimentaria. Todo ello amparado en el consumo consciente, incorporando aprendizajes que permitan un máximo aprovechamiento tanto de los recursos locales como de los de temporada.",
    tags: thematicTags,
  },
  {
    number: "03",
    label: "Educación",
    description:
      "Impulsamos modelos educativos enfocados en el desarrollo permanente del pensamiento crítico, en la creatividad y el aprendizaje experiencial, sumado a una integración e intercambio que respete la diferencia como un recurso de enriquecimiento mutuo. Creemos en espacios de aprendizaje horizontal, colaborativo y conectado a los desafíos reales de nuestro tiempo.",
    tags: thematicTags,
  },
  {
    number: "04",
    label: "Comunidad",
    description:
      "Promovemos modos de organización social basados en la cooperación, la equidad y el cuidado mutuo. Alentamos los procesos de participación ciudadana que desarrollan y fortalecen el tejido comunitario basado en la reciprocidad, el respeto, la aceptación de las diferencias y, finalmente, la toma de decisiones colectivas, partiendo desde un mínimo de acuerdos troncales y centrales.",
    tags: thematicTags,
  },
  {
    number: "05",
    label: "Energía",
    description:
      "Nos identificamos y apoyamos una transición hacia sistemas energéticos renovables, descentralizados y soberanos, desarrollados y gestionados por las comunidades. Promovemos la eficiencia energética como un principio de aprendizaje e interiorización de la conciencia orientada al cuidado medioambiental, promoviendo así la responsabilidad sobre nuestros consumos.",
    tags: thematicTags,
  },
];