"use client";

import { User2Icon } from "lucide-react";
import { Document } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { DocumentTable } from "./document-table";
import { DocumentContent } from "./document-content";
import { useQuery } from "@tanstack/react-query";
import { fetcher } from "@/lib/fetcher";

type DocumentListProps = {
  documents: Document[];
};

export async function DocumentList({ documents }: DocumentListProps) {
  const searchParams = useSearchParams();

  const selectedFileId = searchParams.get("file");
  const selectedFile = selectedFileId
    ? documents.find((doc) => doc.id === selectedFileId && !doc.isFolder)
    : null;

  const selectedFolderId = searchParams.get("folder");

  const { data } = useQuery<Document[]>({
    queryKey: ["folder", selectedFolderId],
    queryFn: () => fetcher(`/api/folders/${selectedFolderId}`),
  });

  const displayedDocuments = selectedFolderId ? data ?? [] : documents;

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
