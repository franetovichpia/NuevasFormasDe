import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  LogOut,
} from "lucide-react";

import { logout } from "@/app/admin/actions";
import { AdminNav } from "@/components/admin/admin-nav";
import {
  requireSession,
  roleLabels,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

type PanelLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default async function PanelLayout({
  children,
}: PanelLayoutProps) {
  const session = await requireSession();

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-ink/10 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <Link
            className="flex items-center gap-2.5 text-sm font-semibold tracking-[-0.02em]"
            href="/admin"
          >
            <Image
              alt=""
              className="size-9 rounded-full"
              height={72}
              src="/images/brand/nfd-logo-circular.webp"
              width={72}
            />
            Nuevas Formas De… · Panel
          </Link>

          <AdminNav />

          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-xs text-ink/50 sm:inline">
              {session.username} ·{" "}
              {roleLabels[session.role]}
            </span>

            <Link
              className="admin-button-secondary min-h-9 px-3"
              href="/"
              target="_blank"
              title="Ver el sitio"
            >
              <ExternalLink
                aria-hidden="true"
                size={14}
              />

              <span className="hidden sm:inline">
                Ver sitio
              </span>
            </Link>

            <form action={logout}>
              <button
                className="admin-button-secondary min-h-9 px-3"
                title="Salir"
                type="submit"
              >
                <LogOut
                  aria-hidden="true"
                  size={14}
                />

                <span className="hidden sm:inline">
                  Salir
                </span>
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </>
  );
}
