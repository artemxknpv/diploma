import { User2Icon } from "lucide-react";
import { Document } from "@prisma/client";
import { DocumentTable } from "./document-table";
import { DocumentContent } from "./document-content";
import { db } from "@/lib/db";

type DocumentListProps = {
  documents: Document[];
};

export async function DocumentList({
  documents,
  params,
}: DocumentListProps & { params: Partial<Record<"file" | "folder", string>> }) {
  const selectedFileId = params.file;
  const selectedFile = selectedFileId
    ? documents.find((doc) => doc.id === selectedFileId && !doc.isFolder)
    : null;

  const selectedFolderId = params.folder;

  const docsInFolder = selectedFolderId
    ? await db.document.findMany({
        where: { parentId: selectedFolderId },
      })
    : null;

  const displayedDocuments = selectedFolderId ? docsInFolder ?? [] : documents;

  return (
    <div className="gap-y-4 grow flex flex-col items-start">
      <div className="flex items-center font-semibold text-lg text-neutral-700 gap-x-2">
        <User2Icon />
        Документы
      </div>
      {selectedFile ? (
        <DocumentContent document={selectedFile} />
      ) : (
        <DocumentTable documents={displayedDocuments} />
      )}
    </div>
  );
}
