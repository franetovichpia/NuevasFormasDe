export type InterrelationColor =
  | "cyan"
  | "blue"
  | "magenta"
  | "coral"
  | "green";

export type InterrelationNode = {
  id: string;
  number: string;
  label: string;
  x: number;
  y: number;
  radius: number;
  color: InterrelationColor;
};

export const interrelationNodes: readonly InterrelationNode[] = [
  {
    id: "salud",
    number: "01",
    label: "Salud",
    x: 150,
    y: 165,
    radius: 62,
    color: "cyan",
  },
  {
    id: "alimentacion",
    number: "02",
    label: "Alimentación",
    x: 400,
    y: 92,
    radius: 68,
    color: "green",
  },
  {
    id: "educacion",
    number: "03",
    label: "Educación",
    x: 655,
    y: 170,
    radius: 62,
    color: "blue",
  },
  {
    id: "comunidad",
    number: "04",
    label: "Comunidad",
    x: 630,
    y: 460,
    radius: 68,
    color: "magenta",
  },
  {
    id: "energia",
    number: "05",
    label: "Energía",
    x: 170,
    y: 465,
    radius: 62,
    color: "coral",
  },
];

export const interrelationLines: readonly [
  string,
  string,
][] = [
  ["salud", "alimentacion"],
  ["alimentacion", "educacion"],
  ["educacion", "comunidad"],
  ["comunidad", "energia"],
  ["energia", "salud"],
];