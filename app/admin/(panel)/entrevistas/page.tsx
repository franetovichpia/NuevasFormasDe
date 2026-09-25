import { InterviewsImporter } from "@/components/admin/interviews-importer";
import { getPublicConversations } from "@/lib/content/repository";

export default async function AdminInterviewsPage() {
  const conversations =
    await getPublicConversations();

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        Entrevistas
      </h1>

      <p className="mt-2 max-w-3xl text-sm text-ink/55">
        Subí una planilla de Excel (.xlsx) o un CSV con una fila por
        entrevista y red social. Antes de publicar vas a ver una
        vista previa para revisar que todo esté bien.
      </p>

      <InterviewsImporter
        conversations={conversations}
      />
    </>
  );
}
