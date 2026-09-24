"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  ImagePlus,
  LoaderCircle,
  Star,
  X,
} from "lucide-react";
import {
  useId,
  useState,
  useTransition,
} from "react";

import {
  saveEvent,
  type EventInput,
} from "@/app/admin/actions";
import { uploadImage } from "@/components/admin/upload-image";
import type {
  EventVisibility,
  NfdEvent,
} from "@/data/events";
import {
  formatEventDateRange,
  getEventStatus,
} from "@/lib/events";
import { cn } from "@/utils/cn";
import { shouldOptimizeImage } from "@/utils/image";

type EventFormProps = {
  event: NfdEvent | null;
};

const visibilityOptions: {
  value: EventVisibility;
  label: string;
  hint: string;
}[] = [
  {
    value: "published",
    label: "Publicado",
    hint: "Se ve en el sitio.",
  },
  {
    value: "draft",
    label: "Borrador",
    hint: "Se guarda sin mostrarse.",
  },
  {
    value: "archived",
    label: "Archivado",
    hint: "Oculto, queda guardado acá.",
  },
];

function toInput(
  event: NfdEvent | null,
): EventInput {
  return {
    id: event?.id ?? null,
    title: event?.title ?? "",
    startDate: event?.startDate ?? "",
    endDate: event?.endDate ?? "",
    date:
      // Si el texto coincide con el generado, se deja vacío
      // para que se actualice solo al cambiar las fechas.
      event &&
      event.date !==
        formatEventDateRange(
          event.startDate,
          event.endDate,
        )
        ? event.date
        : "",
    location: event?.location ?? "",
    status: event?.status ?? "upcoming",
    href: event?.href ?? "",
    description: event?.description ?? "",
    coverImage: event?.coverImage ?? "",
    gallery: [...(event?.gallery ?? [])],
    visibility:
      event?.visibility ?? "draft",
  };
}

function Thumbnail({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <Image
      alt={alt}
      className="object-cover"
      fill
      sizes="12rem"
      src={src}
      unoptimized={
        !shouldOptimizeImage(src)
      }
    />
  );
}

export function EventForm({
  event,
}: EventFormProps) {
  const router = useRouter();
  const formId = useId();

  const [values, setValues] =
    useState<EventInput>(() =>
      toInput(event),
    );

  const [error, setError] = useState<
    string | null
  >(null);

  const [uploadingCount, setUploadingCount] =
    useState(0);

  const [isSaving, startSaving] =
    useTransition();

  const isUploading = uploadingCount > 0;

  function update<
    Key extends keyof EventInput,
  >(key: Key, value: EventInput[Key]) {
    setValues((current) => ({
      ...current,
      [key]: value,
    }));
  }

  const hasDates = Boolean(
    values.startDate,
  );

  const automaticDateLabel =
    formatEventDateRange(
      values.startDate,
      values.endDate,
    );

  const automaticStatus = getEventStatus({
    startDate: values.startDate || null,
    endDate: values.endDate || null,
    status: values.status,
  });

  async function uploadFiles(
    files: FileList | null,
    target: "cover" | "gallery",
  ) {
    if (!files || files.length === 0) {
      return;
    }

    setError(null);

    const selectedFiles =
      target === "cover"
        ? [files[0]]
        : [...files];

    setUploadingCount(
      (count) =>
        count + selectedFiles.length,
    );

    const failures: string[] = [];

    await Promise.all(
      selectedFiles.map(async (file) => {
        try {
          const url = await uploadImage(
            file,
            "events",
          );

          setValues((current) =>
            target === "cover"
              ? {
                  ...current,
                  coverImage: url,
                }
              : {
                  ...current,
                  gallery: [
                    ...current.gallery,
                    url,
                  ],
                },
          );
        } catch (uploadError) {
          failures.push(
            uploadError instanceof Error
              ? uploadError.message
              : `No se pudo subir "${file.name}".`,
          );
        } finally {
          setUploadingCount(
            (count) => count - 1,
          );
        }
      }),
    );

    if (failures.length > 0) {
      setError(failures.join(" "));
    }
  }

  function moveGalleryImage(
    index: number,
    direction: -1 | 1,
  ) {
    setValues((current) => {
      const gallery = [...current.gallery];
      const target = index + direction;

      if (
        target < 0 ||
        target >= gallery.length
      ) {
        return current;
      }

      [gallery[index], gallery[target]] = [
        gallery[target],
        gallery[index],
      ];

      return {
        ...current,
        gallery,
      };
    });
  }

  function handleSubmit(
    submitEvent: React.FormEvent<HTMLFormElement>,
  ) {
    submitEvent.preventDefault();
    setError(null);

    startSaving(async () => {
      const result = await saveEvent({
        ...values,
        status: hasDates
          ? automaticStatus
          : values.status,
      });

      if (!result.ok) {
        setError(result.error);

        return;
      }

      router.push("/admin/eventos");
      router.refresh();
    });
  }

  return (
    <form
      className="mt-8 grid gap-6 lg:grid-cols-[1fr_20rem]"
      onSubmit={handleSubmit}
    >
      <div className="space-y-6">
        {/* Información */}
        <section className="admin-card space-y-5">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">
            Información
          </h2>

          <label className="block">
            <span className="admin-label">
              Título *
            </span>

            <input
              className="admin-input"
              maxLength={200}
              onChange={(inputEvent) => {
                update(
                  "title",
                  inputEvent.target.value,
                );
              }}
              required
              value={values.title}
            />
          </label>

          <label className="block">
            <span className="admin-label">
              Lugar
            </span>

            <input
              className="admin-input"
              maxLength={200}
              onChange={(inputEvent) => {
                update(
                  "location",
                  inputEvent.target.value,
                );
              }}
              placeholder="Ej.: Quinta de Benavidez, Tigre"
              value={values.location}
            />
          </label>

          <label className="block">
            <span className="admin-label">
              Descripción
            </span>

            <textarea
              className="admin-input min-h-56 leading-relaxed"
              maxLength={20000}
              onChange={(inputEvent) => {
                update(
                  "description",
                  inputEvent.target.value,
                );
              }}
              placeholder="Propuesta, programa, información para asistentes…"
              value={values.description}
            />

            <p className="admin-hint">
              Los saltos de línea se respetan en el sitio.
            </p>
          </label>

          <label className="block">
            <span className="admin-label">
              Enlace (opcional)
            </span>

            <input
              className="admin-input"
              onChange={(inputEvent) => {
                update(
                  "href",
                  inputEvent.target.value,
                );
              }}
              placeholder="https://…"
              type="url"
              value={values.href}
            />

            <p className="admin-hint">
              Muestra el botón “Conocer evento” (inscripción,
              entradas, etc.).
            </p>
          </label>
        </section>

        {/* Fechas */}
        <section className="admin-card space-y-5">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">
            Fechas
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="admin-label">
                Fecha de inicio
              </span>

              <input
                className="admin-input"
                onChange={(inputEvent) => {
                  update(
                    "startDate",
                    inputEvent.target.value,
                  );
                }}
                type="date"
                value={values.startDate}
              />
            </label>

            <label className="block">
              <span className="admin-label">
                Fecha de fin (opcional)
              </span>

              <input
                className="admin-input"
                disabled={!values.startDate}
                min={
                  values.startDate || undefined
                }
                onChange={(inputEvent) => {
                  update(
                    "endDate",
                    inputEvent.target.value,
                  );
                }}
                type="date"
                value={values.endDate}
              />
            </label>
          </div>

          <label className="block">
            <span className="admin-label">
              Texto de la fecha (opcional)
            </span>

            <input
              className="admin-input"
              maxLength={120}
              onChange={(inputEvent) => {
                update(
                  "date",
                  inputEvent.target.value,
                );
              }}
              placeholder={
                automaticDateLabel ||
                "Fecha a confirmar"
              }
              value={values.date}
            />

            <p className="admin-hint">
              Si lo dejás vacío se muestra “
              {automaticDateLabel ||
                "Fecha a confirmar"}
              ”. Podés escribir otro texto, por ejemplo
              “Sábados de octubre”.
            </p>
          </label>

          <div>
            <span className="admin-label">
              Próximo o realizado
            </span>

            {hasDates ? (
              <p className="text-sm text-ink/65">
                Se calcula solo según las fechas:{" "}
                <strong>
                  {automaticStatus === "upcoming"
                    ? "próximo evento"
                    : "evento realizado"}
                </strong>
                .
              </p>
            ) : (
              <div className="flex gap-2">
                {(
                  [
                    [
                      "upcoming",
                      "Próximo",
                    ],
                    [
                      "past",
                      "Realizado",
                    ],
                  ] as const
                ).map(([value, label]) => (
                  <label
                    className={cn(
                      "cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold",
                      values.status === value
                        ? "border-nfd-blue bg-nfd-blue text-white"
                        : "border-ink/15 bg-white text-ink/60",
                    )}
                    key={value}
                  >
                    <input
                      checked={
                        values.status === value
                      }
                      className="sr-only"
                      name={`${formId}-status`}
                      onChange={() => {
                        update("status", value);
                      }}
                      type="radio"
                    />
                    {label}
                  </label>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Imágenes */}
        <section className="admin-card space-y-6">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">
            Imágenes
          </h2>

          <div>
            <span className="admin-label">
              Portada
            </span>

            <div className="flex flex-wrap items-center gap-4">
              {values.coverImage ? (
                <div className="relative h-32 w-48 overflow-hidden rounded-xl border border-ink/10 bg-ink/5">
                  <Thumbnail
                    alt="Portada"
                    src={values.coverImage}
                  />

                  <button
                    aria-label="Quitar portada"
                    className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/60 text-white hover:bg-nfd-coral"
                    onClick={() => {
                      update("coverImage", "");
                    }}
                    type="button"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : null}

              <label className="admin-button-secondary">
                <ImagePlus
                  aria-hidden="true"
                  size={15}
                />

                {values.coverImage
                  ? "Cambiar portada"
                  : "Subir portada"}

                <input
                  accept="image/*"
                  className="sr-only"
                  onChange={(inputEvent) => {
                    void uploadFiles(
                      inputEvent.target.files,
                      "cover",
                    );
                    inputEvent.target.value = "";
                  }}
                  type="file"
                />
              </label>
            </div>
          </div>

          <div>
            <span className="admin-label">
              Galería de fotos ({values.gallery.length})
            </span>

            {values.gallery.length > 0 ? (
              <ul className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {values.gallery.map(
                  (image, index) => (
                    <li
                      className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-ink/10 bg-ink/5"
                      key={image}
                    >
                      <Thumbnail
                        alt={`Foto ${index + 1}`}
                        src={image}
                      />

                      <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between gap-1">
                        <div className="flex gap-1">
                          <button
                            aria-label="Mover antes"
                            className="grid size-7 place-items-center rounded-full bg-black/60 text-white hover:bg-nfd-blue disabled:opacity-30"
                            disabled={index === 0}
                            onClick={() => {
                              moveGalleryImage(
                                index,
                                -1,
                              );
                            }}
                            type="button"
                          >
                            <ArrowLeft size={13} />
                          </button>

                          <button
                            aria-label="Mover después"
                            className="grid size-7 place-items-center rounded-full bg-black/60 text-white hover:bg-nfd-blue disabled:opacity-30"
                            disabled={
                              index ===
                              values.gallery.length -
                                1
                            }
                            onClick={() => {
                              moveGalleryImage(
                                index,
                                1,
                              );
                            }}
                            type="button"
                          >
                            <ArrowRight size={13} />
                          </button>
                        </div>

                        <button
                          aria-label="Usar como portada"
                          className="grid size-7 place-items-center rounded-full bg-black/60 text-white hover:bg-amber-500"
                          onClick={() => {
                            update(
                              "coverImage",
                              image,
                            );
                          }}
                          title="Usar como portada"
                          type="button"
                        >
                          <Star size={13} />
                        </button>
                      </div>

                      <button
                        aria-label="Quitar foto"
                        className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/60 text-white hover:bg-nfd-coral"
                        onClick={() => {
                          update(
                            "gallery",
                            values.gallery.filter(
                              (item) =>
                                item !== image,
                            ),
                          );
                        }}
                        type="button"
                      >
                        <X size={14} />
                      </button>
                    </li>
                  ),
                )}
              </ul>
            ) : null}

            <label className="admin-button-secondary">
              <ImagePlus
                aria-hidden="true"
                size={15}
              />
              Agregar fotos

              <input
                accept="image/*"
                className="sr-only"
                multiple
                onChange={(inputEvent) => {
                  void uploadFiles(
                    inputEvent.target.files,
                    "gallery",
                  );
                  inputEvent.target.value = "";
                }}
                type="file"
              />
            </label>

            <p className="admin-hint">
              Podés elegir varias a la vez. Las fotos grandes se
              achican automáticamente.
            </p>
          </div>

          {isUploading ? (
            <p className="flex items-center gap-2 text-sm text-nfd-blue">
              <LoaderCircle
                aria-hidden="true"
                className="animate-spin"
                size={16}
              />
              Subiendo {uploadingCount}{" "}
              {uploadingCount === 1
                ? "imagen"
                : "imágenes"}
              …
            </p>
          ) : null}
        </section>
      </div>

      {/* Publicación */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <section className="admin-card space-y-4">
          <h2 className="text-lg font-semibold tracking-[-0.02em]">
            Publicación
          </h2>

          <div className="space-y-2">
            {visibilityOptions.map(
              (option) => (
                <label
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
                    values.visibility ===
                      option.value
                      ? "border-nfd-blue bg-nfd-blue/5"
                      : "border-ink/10 bg-white hover:border-ink/25",
                  )}
                  key={option.value}
                >
                  <input
                    checked={
                      values.visibility ===
                      option.value
                    }
                    className="mt-0.5 accent-[#006f98]"
                    name={`${formId}-visibility`}
                    onChange={() => {
                      update(
                        "visibility",
                        option.value,
                      );
                    }}
                    type="radio"
                  />

                  <span>
                    <span className="block text-sm font-semibold">
                      {option.label}
                    </span>

                    <span className="block text-xs text-ink/50">
                      {option.hint}
                    </span>
                  </span>
                </label>
              ),
            )}
          </div>

          {error ? (
            <p
              className="rounded-xl bg-nfd-coral/10 px-4 py-3 text-sm text-nfd-coral"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          <button
            className="admin-button-primary w-full"
            disabled={isSaving || isUploading}
            type="submit"
          >
            {isSaving
              ? "Guardando…"
              : isUploading
                ? "Esperando imágenes…"
                : event
                  ? "Guardar cambios"
                  : "Guardar evento"}
          </button>

          <Link
            className="admin-button-secondary w-full"
            href="/admin/eventos"
          >
            Cancelar
          </Link>
        </section>
      </aside>
    </form>
  );
}
