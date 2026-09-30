"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/utils/cn";

const links = [
  {
    href: "/admin/eventos",
    label: "Eventos",
  },
  {
    href: "/admin/entrevistas",
    label: "Entrevistas",
  },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Secciones del panel"
      className="flex gap-1"
    >
      {links.map((link) => {
        const isActive =
          pathname.startsWith(link.href);

        return (
          <Link
            aria-current={
              isActive ? "page" : undefined
            }
            className={cn(
              "rounded-full px-3.5 py-2 text-xs font-semibold transition-colors",
              isActive
                ? "bg-nfd-blue text-white"
                : "text-ink/60 hover:bg-ink/5 hover:text-ink",
            )}
            href={link.href}
            key={link.href}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
