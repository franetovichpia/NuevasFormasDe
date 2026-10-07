import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { LoginForm } from "@/components/admin/login-form";
import {
  getAuthConfigProblems,
  getSession,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) {
    redirect("/admin");
  }

  const configProblems =
    getAuthConfigProblems();

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <Link
          className="mb-4 inline-flex items-center gap-2 rounded-full px-2 py-1.5 text-xs font-semibold text-ink/60 transition-colors hover:text-nfd-blue"
          href="/"
        >
          <ArrowLeft
            aria-hidden="true"
            size={16}
          />
          Volver al sitio
        </Link>

        <div className="rounded-[1.6rem] border border-ink/10 bg-white/70 p-7 shadow-[0_1.5rem_4rem_rgb(28_42_54/0.12)] backdrop-blur-xl sm:p-8">
          <Image
            alt="Nuevas Formas De..."
            className="size-24 rounded-full"
            height={192}
            priority
            src="/images/brand/nfd-logo-circular.webp"
            width={192}
          />

          <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
            Panel de contenidos
          </h1>

          <p className="mt-2 text-sm text-ink/55">
            Ingresá con tu usuario para administrar eventos y
            entrevistas.
          </p>

          {configProblems.length === 0 ? (
            <LoginForm />
          ) : (
            <div className="mt-6 rounded-xl border border-nfd-coral/30 bg-nfd-coral/10 p-4 text-sm text-nfd-coral">
              <p className="font-semibold">
                El acceso todavía no está configurado en este
                servidor:
              </p>

              <ul className="mt-2 list-disc space-y-1 pl-5">
                {configProblems.map((problem) => (
                  <li key={problem}>{problem}</li>
                ))}
              </ul>

              <p className="mt-3 text-ink/60">
                En Vercel se cargan en Settings → Environment
                Variables (marcando el entorno que estás usando) y
                después hay que volver a publicar. En tu computadora,
                en el archivo .env.local, y reiniciar npm run dev.
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
