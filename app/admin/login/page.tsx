import Image from "next/image";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import {
  getSession,
  isAuthConfigured,
} from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await getSession()) {
    redirect("/admin");
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-12">
      <div className="w-full max-w-sm rounded-[1.6rem] border border-ink/10 bg-white/70 p-7 shadow-[0_1.5rem_4rem_rgb(28_42_54/0.12)] backdrop-blur-xl sm:p-8">
        <Image
          alt="Nuevas Formas De..."
          className="h-auto w-28"
          height={120}
          priority
          src="/images/brand/nfd-logo.png"
          width={220}
        />

        <h1 className="mt-6 text-2xl font-semibold tracking-[-0.03em]">
          Panel de contenidos
        </h1>

        <p className="mt-2 text-sm text-ink/55">
          Ingresá con tu usuario para administrar eventos y
          entrevistas.
        </p>

        {isAuthConfigured() ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-xl border border-nfd-coral/30 bg-nfd-coral/10 p-4 text-sm text-nfd-coral">
            El acceso todavía no está configurado. Hay que definir
            las variables NFD_SESSION_SECRET, NFD_ADMIN_PASSWORD y
            NFD_EDITOR_PASSWORD en el servidor.
          </p>
        )}
      </div>
    </main>
  );
}
