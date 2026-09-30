"use client";

import { useRouter } from "next/navigation";
import {
  CircleAlert,
  CircleCheck,
  ExternalLink,
  Link2,
  LoaderCircle,
  RefreshCw,
  Unlink,
} from "lucide-react";
import {
  useState,
  useTransition,
} from "react";

import {
  connectInterviewsSheet,
  disconnectInterviewsSheet,
  refreshInterviewsSheet,
} from "@/app/admin/actions";
import type { SheetStatus } from "@/lib/content/repository";

type SheetConnectionProps = {
  status: SheetStatus;
  refreshMinutes: number;
};

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("es-AR", {
    timeZone:
      "America/Argentina/Buenos_Aires",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/**
 * Conexión con una planilla de Google Sheets: el sitio lee las entrevistas
 * directamente de ahí y se actualiza solo.
 */
export function SheetConnection({
  status,
  refreshMinutes,
}: SheetConnectionProps) {
  const router = useRouter();

  const [url, setUrl] = useState("");

  const [message, setMessage] = useState<{
    tone: "error" | "success";
    text: string;
  } | null>(null);

  const [isPending, startTransition] =
    useTransition();

  function run(
    action: () => Promise<
      | {
          ok: true;
        }
      | {
          ok: false;
          error: string;
        }
    >,
    successText: (() => string) | null,
  ) {
    setMessage(null);

    startTransition(async () => {
      const result = await action();

      if (!result.ok) {
        setMessage({
          tone: "error",
          text: result.error,
        });

        return;
      }

      if (successText) {
        setMessage({
          tone: "success",
          text: successText(),
        });
      }

      router.refresh();
    });
  }

  return (
    <section className="admin-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold tracking-[-0.02em]">
            Leer desde Google Sheets
          </h2>

          <p className="mt-1 max-w-2xl text-sm text-ink/55">
            {status.connected
              ? `El sitio muestra las entrevistas de la planilla y la vuelve a leer sola cada ${refreshMinutes} minutos. Con “Actualizar ahora” se ven los cambios al instante.`
              : "Conectá una planilla y el sitio va a leer las entrevistas directamente de ahí: cada cambio que guardes en Google Sheets se publica solo, sin volver a subir el archivo."}
          </p>
        </div>

        {status.connected ? (
          <span
            className={
              status.ok
                ? "rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800"
                : "rounded-full bg-nfd-coral/15 px-3 py-1 text-xs font-semibold text-nfd-coral"
            }
          >
            {status.ok
              ? "Conectada"
              : "Con problemas"}
          </span>
        ) : null}
      </div>

      {status.connected ? (
        <div className="mt-5 space-y-4">
          <a
            className="inline-flex max-w-full items-center gap-2 truncate text-sm text-nfd-blue underline-offset-2 hover:underline"
            href={status.url}
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink
              aria-hidden="true"
              className="shrink-0"
              size={14}
            />
            <span className="truncate">
              Abrir la planilla
            </span>
          </a>

          {status.ok ? (
            <p className="text-sm text-ink/65">
              <strong>
                {status.result.conversations.length}{" "}
                entrevistas
              </strong>{" "}
              publicadas desde {status.result.rowCount} filas
              · última lectura:{" "}
              <time
                dateTime={status.result.fetchedAt}
                suppressHydrationWarning
              >
                {formatTime(status.result.fetchedAt)}
              </time>
            </p>
          ) : (
            <p className="flex items-start gap-2 rounded-xl bg-nfd-coral/10 px-4 py-3 text-sm text-nfd-coral">
              <CircleAlert
                aria-hidden="true"
                className="mt-0.5 shrink-0"
                size={16}
              />
              {status.error} Mientras tanto, el sitio muestra la
              última lista guardada en el panel.
            </p>
          )}

          {status.ok &&
          status.result.issues.length > 0 ? (
            <div className="rounded-xl border border-amber-300/60 bg-amber-50 p-4">
              <p className="text-sm font-semibold text-amber-900">
                Estas filas no se muestran en el sitio hasta
                corregirlas en la planilla:
              </p>

              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-900/80">
                {status.result.issues.map(
                  (issue, index) => (
                    <li key={index}>
                      {issue.rowNumber
                        ? `Fila ${issue.rowNumber}: `
                        : ""}
                      {issue.message}
                    </li>
                  ),
                )}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <button
              className="admin-button-primary"
              disabled={isPending}
              onClick={() => {
                run(
                  refreshInterviewsSheet,
                  () =>
                    "Listo, se volvió a leer la planilla.",
                );
              }}
              type="button"
            >
              {isPending ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  size={15}
                />
              ) : (
                <RefreshCw
                  aria-hidden="true"
                  size={15}
                />
              )}
              Actualizar ahora
            </button>

            <button
              className="admin-button-danger"
              disabled={isPending}
              onClick={() => {
                if (
                  window.confirm(
                    "¿Desconectar la planilla? El sitio va a volver a mostrar la última lista subida desde el panel.",
                  )
                ) {
                  run(
                    disconnectInterviewsSheet,
                    null,
                  );
                }
              }}
              type="button"
            >
              <Unlink
                aria-hidden="true"
                size={15}
              />
              Desconectar
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          <ol className="list-decimal space-y-1.5 pl-5 text-sm text-ink/65">
            <li>
              Armá la planilla con las mismas columnas que la
              plantilla (podés importar “Descargar entrevistas
              actuales” en Google Sheets).
            </li>
            <li>
              En Google Sheets tocá <strong>Compartir</strong> →
              “Acceso general” →{" "}
              <strong>
                Cualquier persona con el enlace · Lector
              </strong>
              .
            </li>
            <li>
              En la columna <strong>foto</strong> poné enlaces:
              de Google Drive (compartidos igual que la planilla)
              o de cualquier imagen publicada.
            </li>
            <li>
              Copiá el enlace de la planilla y pegalo acá. Las
              filas de arriba se muestran primero.
            </li>
          </ol>

          <form
            className="flex flex-col gap-2 sm:flex-row"
            onSubmit={(submitEvent) => {
              submitEvent.preventDefault();

              run(
                () => connectInterviewsSheet(url),
                () =>
                  "¡Planilla conectada! El sitio ya muestra sus entrevistas.",
              );
            }}
          >
            <input
              className="admin-input flex-1"
              inputMode="url"
              maxLength={1000}
              onChange={(inputEvent) => {
                setUrl(inputEvent.target.value);
              }}
              placeholder="https://docs.google.com/spreadsheets/d/…"
              required
              type="url"
              value={url}
            />

            <button
              className="admin-button-primary shrink-0"
              disabled={isPending}
              type="submit"
            >
              {isPending ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  size={15}
                />
              ) : (
                <Link2
                  aria-hidden="true"
                  size={15}
                />
              )}
              Conectar
            </button>
          </form>
        </div>
      )}

      {message ? (
        <p
          className={
            message.tone === "error"
              ? "mt-4 flex items-start gap-2 rounded-xl bg-nfd-coral/10 px-4 py-3 text-sm text-nfd-coral"
              : "mt-4 flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          }
          role={
            message.tone === "error"
              ? "alert"
              : "status"
          }
        >
          {message.tone === "error" ? (
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={16}
            />
          ) : (
            <CircleCheck
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={16}
            />
          )}
          {message.text}
        </p>
      ) : null}
    </section>
  );
}
