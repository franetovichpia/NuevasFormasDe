"use client";

import { useRouter } from "next/navigation";
import {
  CircleAlert,
  CircleCheck,
  Download,
  FileSpreadsheet,
  Images,
  LoaderCircle,
  Upload,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  importInterviews,
  type ImportSummary,
} from "@/app/admin/actions";
import { uploadImage } from "@/components/admin/upload-image";
import {
  conversationCategories,
  conversationCategoryLabels,
  normalizeText,
} from "@/data/categories";
import type {
  Conversation,
  ConversationPlatform,
} from "@/data/conversations";
import {
  conversationsToRows,
  interpretSheet,
  isPhotoReference,
  parseCsv,
  templateHeaders,
  toCsv,
  type ImportIssue,
  type ImportRow,
  type ResolvedImportRow,
} from "@/lib/interviews-import";
import { cn } from "@/utils/cn";

const platformLabels: Record<
  ConversationPlatform,
  string
> = {
  youtube: "YouTube",
  instagram: "Instagram",
  podcast: "Spotify",
};

type PhotoSource =
  | {
      kind: "url";
      url: string;
    }
  | {
      kind: "file";
      file: File;
    }
  | {
      kind: "keep";
      url: string;
    }
  | {
      kind: "missing";
      message: string;
    };

type InterviewsImporterProps = {
  conversations: Conversation[];
};

function downloadCsv(
  fileName: string,
  rows: string[][],
) {
  const blob = new Blob([toCsv(rows)], {
    type: "text/csv;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();

  URL.revokeObjectURL(url);
}

function fileKey(name: string) {
  const baseName =
    name.split(/[\\/]/).pop() ?? name;

  return normalizeText(baseName);
}

function fileKeyWithoutExtension(
  name: string,
) {
  return fileKey(
    name.replace(/\.[^.]+$/, ""),
  );
}

async function readSpreadsheet(
  file: File,
): Promise<unknown[][]> {
  const extension = file.name
    .split(".")
    .pop()
    ?.toLowerCase();

  if (extension === "xlsx") {
    const { readSheet } = await import(
      "read-excel-file/browser"
    );

    return (await readSheet(
      file,
    )) as unknown[][];
  }

  if (extension === "xls") {
    throw new Error(
      "El formato .xls antiguo no es compatible. En Excel usá “Guardar como” → Libro de Excel (.xlsx) o CSV.",
    );
  }

  return parseCsv(await file.text());
}

export function InterviewsImporter({
  conversations,
}: InterviewsImporterProps) {
  const router = useRouter();

  const [sheetName, setSheetName] =
    useState<string | null>(null);

  const [rows, setRows] = useState<
    ImportRow[]
  >([]);

  const [issues, setIssues] = useState<
    ImportIssue[]
  >([]);

  const [photoFiles, setPhotoFiles] =
    useState<File[]>([]);

  const [mode, setMode] = useState<
    "merge" | "replace"
  >("merge");

  const [status, setStatus] = useState<
    "idle" | "reading" | "uploading" | "saving"
  >("idle");

  const [progress, setProgress] =
    useState("");

  const [error, setError] = useState<
    string | null
  >(null);

  const [result, setResult] =
    useState<ImportSummary | null>(null);

  const existingBySlug = useMemo(
    () =>
      new Map(
        conversations.map(
          (conversation) => [
            conversation.slug,
            conversation,
          ],
        ),
      ),
    [conversations],
  );

  const photoSources = useMemo(() => {
    const filesByName = new Map<
      string,
      File
    >();

    for (const file of photoFiles) {
      filesByName.set(
        fileKey(file.name),
        file,
      );
      filesByName.set(
        fileKeyWithoutExtension(file.name),
        file,
      );
    }

    return rows.map(
      (row): PhotoSource => {
        const photo = row.photo.trim();

        if (!photo) {
          const previous = existingBySlug
            .get(row.slug)
            ?.media.find(
              (media) =>
                media.platform ===
                row.platform,
            );

          return previous
            ? {
                kind: "keep",
                url: previous.image,
              }
            : {
                kind: "missing",
                message:
                  "falta la foto",
              };
        }

        if (isPhotoReference(photo)) {
          return {
            kind: "url",
            url: photo,
          };
        }

        const file =
          filesByName.get(
            fileKey(photo),
          ) ??
          filesByName.get(
            fileKeyWithoutExtension(photo),
          );

        return file
          ? {
              kind: "file",
              file,
            }
          : {
              kind: "missing",
              message: `no se encontró “${photo}” entre las fotos seleccionadas`,
            };
      },
    );
  }, [
    rows,
    photoFiles,
    existingBySlug,
  ]);

  // Vistas previas de las fotos elegidas desde la computadora.
  const [previewUrls, setPreviewUrls] =
    useState<Map<File, string>>(
      () => new Map(),
    );

  function selectPhotos(files: File[]) {
    for (const url of previewUrls.values()) {
      URL.revokeObjectURL(url);
    }

    setPhotoFiles(files);
    setPreviewUrls(
      new Map(
        files.map((file) => [
          file,
          URL.createObjectURL(file),
        ]),
      ),
    );
  }

  useEffect(
    () => () => {
      for (const url of previewUrls.values()) {
        URL.revokeObjectURL(url);
      }
    },
    [previewUrls],
  );

  const photoIssues: ImportIssue[] =
    rows.flatMap((row, index) => {
      const source = photoSources[index];

      return source?.kind === "missing"
        ? [
            {
              rowNumber: row.rowNumber,
              message: `“${row.title}”: ${source.message}`,
            },
          ]
        : [];
    });

  const allIssues = [
    ...issues,
    ...photoIssues,
  ].sort(
    (first, second) =>
      (first.rowNumber ?? 0) -
      (second.rowNumber ?? 0),
  );

  const groupedCount = new Set(
    rows.map((row) => row.slug),
  ).size;

  const newCount = new Set(
    rows
      .filter(
        (row) =>
          !existingBySlug.has(row.slug),
      )
      .map((row) => row.slug),
  ).size;

  const isBusy = status !== "idle";

  const canPublish =
    rows.length > 0 &&
    allIssues.length === 0 &&
    !isBusy;

  async function handleSheet(
    file: File | undefined,
  ) {
    if (!file) {
      return;
    }

    setError(null);
    setResult(null);
    setStatus("reading");

    try {
      const sheet =
        await readSpreadsheet(file);

      const interpreted =
        interpretSheet(sheet);

      setSheetName(file.name);
      setRows(interpreted.rows);
      setIssues(interpreted.issues);
    } catch (readError) {
      setSheetName(null);
      setRows([]);
      setIssues([]);
      setError(
        readError instanceof Error
          ? readError.message
          : "No se pudo leer el archivo.",
      );
    } finally {
      setStatus("idle");
    }
  }

  async function publish() {
    if (!canPublish) {
      return;
    }

    if (
      mode === "replace" &&
      !window.confirm(
        `La planilla va a reemplazar todas las entrevistas publicadas (${conversations.length}). Las que no estén en la planilla dejarán de verse. ¿Continuar?`,
      )
    ) {
      return;
    }

    setError(null);
    setResult(null);

    try {
      // 1. Subir las fotos elegidas desde la computadora.
      const filesToUpload = [
        ...new Set(
          photoSources.flatMap((source) =>
            source.kind === "file"
              ? [source.file]
              : [],
          ),
        ),
      ];

      const uploadedUrls = new Map<
        File,
        string
      >();

      if (filesToUpload.length > 0) {
        setStatus("uploading");

        for (const [
          index,
          file,
        ] of filesToUpload.entries()) {
          setProgress(
            `Subiendo fotos ${index + 1} de ${filesToUpload.length}…`,
          );

          uploadedUrls.set(
            file,
            await uploadImage(
              file,
              "conversations",
            ),
          );
        }
      }

      // 2. Guardar las entrevistas.
      setStatus("saving");
      setProgress(
        "Publicando entrevistas…",
      );

      const resolvedRows: ResolvedImportRow[] =
        rows.map((row, index) => {
          const source =
            photoSources[index];

          const { photo, ...rest } = row;

          void photo;

          return {
            ...rest,
            image:
              source.kind === "url"
                ? source.url
                : source.kind === "file"
                  ? uploadedUrls.get(
                      source.file,
                    ) ?? ""
                  : "",
          };
        });

      const response =
        await importInterviews(
          resolvedRows,
          mode,
        );

      if (!response.ok) {
        setError(response.error);

        if (response.issues) {
          setIssues(response.issues);
        }

        return;
      }

      setResult(response.data);
      setRows([]);
      setIssues([]);
      selectPhotos([]);
      setSheetName(null);
      router.refresh();
    } catch (publishError) {
      setError(
        publishError instanceof Error
          ? publishError.message
          : "No se pudo completar la importación.",
      );
    } finally {
      setStatus("idle");
      setProgress("");
    }
  }

  return (
    <div className="mt-8 space-y-6">
      {/* Formato */}
      <section className="admin-card">
        <h2 className="text-lg font-semibold tracking-[-0.02em]">
          Formato de la planilla
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-xs">
            <thead>
              <tr className="border-b border-ink/10 text-ink/45">
                <th className="py-2 pr-4 font-semibold">
                  Columna
                </th>
                <th className="py-2 font-semibold">
                  Qué va
                </th>
              </tr>
            </thead>

            <tbody className="text-ink/70 [&_td]:py-2 [&_td]:pr-4 [&_td]:align-top [&_tr]:border-b [&_tr]:border-ink/5">
              <tr>
                <td className="font-semibold">
                  nombre *
                </td>
                <td>
                  Título de la entrevista, por ejemplo “La
                  Reconquista”.
                </td>
              </tr>
              <tr>
                <td className="font-semibold">
                  invitado
                </td>
                <td>
                  Persona entrevistada. Se muestra como “Con …”.
                </td>
              </tr>
              <tr>
                <td className="font-semibold">info</td>
                <td>
                  Dato breve arriba del título, normalmente la
                  fecha: “13 de agosto de 2026”.
                </td>
              </tr>
              <tr>
                <td className="font-semibold">
                  descripcion
                </td>
                <td>
                  Texto corto debajo del título (opcional).
                </td>
              </tr>
              <tr>
                <td className="font-semibold">
                  categoria
                </td>
                <td>
                  Una o varias separadas por coma:{" "}
                  {conversationCategories
                    .map((category) => category.label)
                    .join(", ")}
                  .
                </td>
              </tr>
              <tr>
                <td className="font-semibold">
                  plataforma
                </td>
                <td>
                  youtube, instagram o spotify. Si se deja vacía se
                  deduce del link.
                </td>
              </tr>
              <tr>
                <td className="font-semibold">link *</td>
                <td>
                  Enlace a la publicación (https://…).
                </td>
              </tr>
              <tr>
                <td className="font-semibold">foto *</td>
                <td>
                  Enlace a la imagen, o el nombre del archivo (por
                  ejemplo “la-reconquista.png”) que subís abajo
                  junto con la planilla. En una entrevista que ya
                  existe se puede dejar vacía para conservar la foto
                  actual.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="admin-hint">
          Si una entrevista está en varias redes, repetí el mismo
          nombre en una fila por red: se agrupan en una sola tarjeta
          con los íconos de cada red.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            className="admin-button-secondary"
            onClick={() => {
              downloadCsv(
                "plantilla-entrevistas.csv",
                [
                  [...templateHeaders],
                  [
                    "Título de la entrevista",
                    "Nombre y apellido",
                    "13 de agosto de 2026",
                    "Una frase que resuma la charla",
                    "Energías, Sistemas",
                    "youtube",
                    "https://www.youtube.com/watch?v=…",
                    "titulo-de-la-entrevista.jpg",
                  ],
                ],
              );
            }}
            type="button"
          >
            <Download
              aria-hidden="true"
              size={15}
            />
            Descargar plantilla
          </button>

          <button
            className="admin-button-secondary"
            onClick={() => {
              downloadCsv(
                "entrevistas-actuales.csv",
                conversationsToRows(
                  conversations,
                ),
              );
            }}
            type="button"
          >
            <Download
              aria-hidden="true"
              size={15}
            />
            Descargar entrevistas actuales
          </button>
        </div>

        <p className="admin-hint">
          Tip: descargá las entrevistas actuales, completá la columna
          categoría en Excel y volvé a subir el archivo.
        </p>
      </section>

      {/* Carga */}
      <section className="admin-card space-y-5">
        <h2 className="text-lg font-semibold tracking-[-0.02em]">
          Subir planilla
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/15 bg-white p-6 text-center transition-colors hover:border-nfd-blue/50">
            <FileSpreadsheet
              aria-hidden="true"
              className="text-nfd-blue"
              size={28}
              strokeWidth={1.5}
            />

            <span className="text-sm font-semibold">
              {sheetName ??
                "Elegir planilla (.xlsx o .csv)"}
            </span>

            <span className="text-xs text-ink/45">
              {sheetName
                ? "Tocá para elegir otra"
                : "Excel, Google Sheets o CSV"}
            </span>

            <input
              accept=".csv,.xlsx,.xls,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              className="sr-only"
              disabled={isBusy}
              onChange={(inputEvent) => {
                void handleSheet(
                  inputEvent.target.files?.[0],
                );
                inputEvent.target.value = "";
              }}
              type="file"
            />
          </label>

          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink/15 bg-white p-6 text-center transition-colors hover:border-nfd-magenta/50">
            <Images
              aria-hidden="true"
              className="text-nfd-magenta"
              size={28}
              strokeWidth={1.5}
            />

            <span className="text-sm font-semibold">
              {photoFiles.length > 0
                ? `${photoFiles.length} fotos seleccionadas`
                : "Elegir fotos (opcional)"}
            </span>

            <span className="text-xs text-ink/45">
              Solo si en la columna foto pusiste nombres de archivo
            </span>

            <input
              accept="image/*"
              className="sr-only"
              disabled={isBusy}
              multiple
              onChange={(inputEvent) => {
                selectPhotos([
                  ...(inputEvent.target.files ??
                    []),
                ]);
                inputEvent.target.value = "";
              }}
              type="file"
            />
          </label>
        </div>

        <fieldset>
          <legend className="admin-label">
            ¿Qué hacer con las entrevistas actuales?
          </legend>

          <div className="grid gap-2 md:grid-cols-2">
            {(
              [
                [
                  "merge",
                  "Agregar y actualizar",
                  "Las nuevas se suman al principio y las que tienen el mismo nombre se actualizan. El resto queda igual.",
                ],
                [
                  "replace",
                  "Reemplazar todas",
                  "La planilla pasa a ser la lista completa. Las que no estén en la planilla dejan de mostrarse.",
                ],
              ] as const
            ).map(([value, label, hint]) => (
              <label
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                  mode === value
                    ? "border-nfd-blue bg-nfd-blue/5"
                    : "border-ink/10 bg-white hover:border-ink/25",
                )}
                key={value}
              >
                <input
                  checked={mode === value}
                  className="mt-0.5 accent-[#006f98]"
                  name="import-mode"
                  onChange={() => {
                    setMode(value);
                  }}
                  type="radio"
                />

                <span>
                  <span className="block text-sm font-semibold">
                    {label}
                  </span>

                  <span className="block text-xs text-ink/50">
                    {hint}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {status === "reading" ? (
          <p className="flex items-center gap-2 text-sm text-nfd-blue">
            <LoaderCircle
              aria-hidden="true"
              className="animate-spin"
              size={16}
            />
            Leyendo planilla…
          </p>
        ) : null}

        {error ? (
          <p
            className="flex items-start gap-2 rounded-xl bg-nfd-coral/10 px-4 py-3 text-sm text-nfd-coral"
            role="alert"
          >
            <CircleAlert
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={16}
            />
            {error}
          </p>
        ) : null}

        {result ? (
          <p
            className="flex items-start gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
            role="status"
          >
            <CircleCheck
              aria-hidden="true"
              className="mt-0.5 shrink-0"
              size={16}
            />
            ¡Listo! {result.created} nuevas y {result.updated}{" "}
            actualizadas. Ahora hay {result.total} entrevistas
            publicadas en el sitio.
          </p>
        ) : null}
      </section>

      {/* Vista previa */}
      {rows.length > 0 || allIssues.length > 0 ? (
        <section className="admin-card space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-[-0.02em]">
                Vista previa
              </h2>

              <p className="text-sm text-ink/55">
                {rows.length} filas · {groupedCount} entrevistas (
                {newCount} nuevas, {groupedCount - newCount} ya
                existentes)
              </p>
            </div>

            <button
              className="admin-button-primary"
              disabled={!canPublish}
              onClick={() => {
                void publish();
              }}
              type="button"
            >
              {isBusy &&
              status !== "reading" ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="animate-spin"
                  size={15}
                />
              ) : (
                <Upload
                  aria-hidden="true"
                  size={15}
                />
              )}

              {progress ||
                "Publicar entrevistas"}
            </button>
          </div>

          {allIssues.length > 0 ? (
            <div
              className="rounded-xl border border-nfd-coral/25 bg-nfd-coral/5 p-4"
              role="alert"
            >
              <p className="text-sm font-semibold text-nfd-coral">
                Corregí estos puntos en la planilla y volvé a
                subirla:
              </p>

              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/70">
                {allIssues.map((issue, index) => (
                  <li key={index}>
                    {issue.rowNumber
                      ? `Fila ${issue.rowNumber}: `
                      : ""}
                    {issue.message}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[52rem] text-left text-xs">
                <thead>
                  <tr className="border-b border-ink/10 text-ink/45">
                    <th className="py-2 pr-3 font-semibold">
                      Fila
                    </th>
                    <th className="py-2 pr-3 font-semibold">
                      Foto
                    </th>
                    <th className="py-2 pr-3 font-semibold">
                      Entrevista
                    </th>
                    <th className="py-2 pr-3 font-semibold">
                      Categorías
                    </th>
                    <th className="py-2 pr-3 font-semibold">
                      Red
                    </th>
                    <th className="py-2 font-semibold">
                      Estado
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {rows.map((row, index) => {
                    const source =
                      photoSources[index];

                    const previewUrl =
                      source.kind === "file"
                        ? previewUrls.get(
                            source.file,
                          )
                        : source.kind === "url" ||
                            source.kind === "keep"
                          ? source.url
                          : undefined;

                    return (
                      <tr
                        className="border-b border-ink/5 align-top"
                        key={`${row.rowNumber}-${row.slug}`}
                      >
                        <td className="py-2.5 pr-3 text-ink/40">
                          {row.rowNumber}
                        </td>

                        <td className="py-2.5 pr-3">
                          <div className="relative size-14 overflow-hidden rounded-lg bg-ink/5">
                            {previewUrl ? (
                              // Vista previa local: no pasa por el optimizador.
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                alt=""
                                className="size-full object-cover"
                                src={previewUrl}
                              />
                            ) : (
                              <CircleAlert
                                aria-hidden="true"
                                className="absolute inset-0 m-auto text-nfd-coral"
                                size={18}
                              />
                            )}
                          </div>
                        </td>

                        <td className="py-2.5 pr-3">
                          <p className="font-semibold text-ink">
                            {row.title}
                          </p>

                          <p className="text-ink/50">
                            {[
                              row.guest
                                ? `Con ${row.guest}`
                                : "",
                              row.info,
                            ]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>

                          {row.description ? (
                            <p className="mt-1 line-clamp-2 text-ink/45">
                              {row.description}
                            </p>
                          ) : null}
                        </td>

                        <td className="py-2.5 pr-3 text-ink/60">
                          {row.categories.length > 0
                            ? row.categories
                                .map(
                                  (category) =>
                                    conversationCategoryLabels[
                                      category
                                    ],
                                )
                                .join(", ")
                            : "—"}
                        </td>

                        <td className="py-2.5 pr-3">
                          <a
                            className="text-nfd-blue underline-offset-2 hover:underline"
                            href={row.link}
                            rel="noreferrer"
                            target="_blank"
                          >
                            {
                              platformLabels[
                                row.platform
                              ]
                            }
                          </a>
                        </td>

                        <td className="py-2.5 text-ink/60">
                          {existingBySlug.has(row.slug)
                            ? "Actualiza"
                            : "Nueva"}
                          {source.kind === "keep"
                            ? " · mantiene foto"
                            : ""}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}

      {/* Publicadas */}
      <section className="admin-card">
        <h2 className="text-lg font-semibold tracking-[-0.02em]">
          Publicadas ahora ({conversations.length})
        </h2>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[40rem] text-left text-xs">
            <thead>
              <tr className="border-b border-ink/10 text-ink/45">
                <th className="py-2 pr-3 font-semibold">
                  Entrevista
                </th>
                <th className="py-2 pr-3 font-semibold">
                  Categorías
                </th>
                <th className="py-2 font-semibold">
                  Redes
                </th>
              </tr>
            </thead>

            <tbody>
              {conversations.map(
                (conversation) => (
                  <tr
                    className="border-b border-ink/5"
                    key={conversation.slug}
                  >
                    <td className="py-2 pr-3">
                      <span className="font-semibold">
                        {conversation.title}
                      </span>

                      {conversation.guest ? (
                        <span className="text-ink/45">
                          {" "}
                          · {conversation.guest}
                        </span>
                      ) : null}
                    </td>

                    <td className="py-2 pr-3 text-ink/60">
                      {(conversation.categories ?? [])
                        .length > 0 ? (
                        (
                          conversation.categories ??
                          []
                        )
                          .map(
                            (category) =>
                              conversationCategoryLabels[
                                category
                              ],
                          )
                          .join(", ")
                      ) : (
                        <span className="text-amber-700">
                          Sin categoría
                        </span>
                      )}
                    </td>

                    <td className="py-2 text-ink/60">
                      {conversation.media
                        .map(
                          (media) =>
                            platformLabels[
                              media.platform
                            ],
                        )
                        .join(", ")}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
