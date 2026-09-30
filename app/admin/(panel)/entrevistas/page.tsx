import { InterviewsImporter } from "@/components/admin/interviews-importer";
import { SheetConnection } from "@/components/admin/sheet-connection";
import {
  getPublicConversations,
  getSheetStatus,
  SHEET_REFRESH_SECONDS,
} from "@/lib/content/repository";

export default async function AdminInterviewsPage() {
  const [conversations, sheetStatus] =
    await Promise.all([
      getPublicConversations(),
      getSheetStatus(),
    ]);

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-[-0.04em]">
        Entrevistas
      </h1>

      <p className="mt-2 max-w-3xl text-sm text-ink/55">
        Conectá una planilla de Google Sheets para que el sitio lea las
        entrevistas directamente, o subí un Excel (.xlsx) o CSV con una
        fila por entrevista y red social.
      </p>

      <div className="mt-8">
        <SheetConnection
          refreshMinutes={
            SHEET_REFRESH_SECONDS / 60
          }
          status={sheetStatus}
        />
      </div>

      <InterviewsImporter
        conversations={conversations}
        sheetConnected={sheetStatus.connected}
      />
    </>
  );
}
