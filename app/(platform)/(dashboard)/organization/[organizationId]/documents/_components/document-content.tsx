import { ArrowLeftIcon, GlobeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Document } from "@prisma/client";
import { DocumentsEditor } from "@/app/(platform)/(dashboard)/organization/[organizationId]/documents/_components/documents-editor";
import { useAction } from "@/hooks/use-action";
import { editDocument } from "@/actions/document/edit";

type DocumentContentProps = {
  document: Document;
};

export function DocumentContent({ document }: DocumentContentProps) {
  const router = useRouter();
  const { execute: updateDocument } = useAction(editDocument, {});

  const onChange = (content: string) => {
    updateDocument({ documents: [{ id: document.id, content }] });
  };

  return (
    <div className="flex flex-col gap-y-4 w-full items-start">
      <div
        className="inline-flex gap-x-2 items-center cursor-pointer"
        role="button"
        onClick={router.back}
      >
        <ArrowLeftIcon className="w-4 h-4" /> Назад
      </div>
      <div className="px-[54px] flex items-center">
        <h2 className="text-zinc-600 text-4xl font-semibold">
          {document.title}
        </h2>
        {document.public ? (
          <GlobeIcon className="ml-2 w-5 h-5 text-zinc-600" />
        ) : null}
      </div>

      <DocumentsEditor
        onChange={onChange}
        initialContent={document.content ?? undefined}
      />
    </div>
  );
}
