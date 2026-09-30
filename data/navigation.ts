export type NavigationItem = {
  label: string;
  href: string;
};

// Los enlaces empiezan con "/" para que funcionen también
// desde otras páginas (por ejemplo, /entrevistas).
export const mainNavigation: readonly NavigationItem[] = [
  {
    label: "Inicio",
    href: "/#inicio",
  },
  {
    label: "Eventos",
    href: "/#eventos",
  },
  {
    label: "Actividades",
    href: "/#actividades",
  },
  {
    label: "Entrevistas",
    href: "/#conversaciones",
  },
  {
    label: "Equipo",
    href: "/#quienes-participan",
  },
  {
    label: "Nexo Azul",
    href: "/#nexo-azul",
  },
  {
    label: "Contacto",
    href: "/#contacto",
  },
];
