import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ValidateMount } from "@/components/validate-mount";
import dynamic from "next/dynamic";

const DocumentsEditor = dynamic(
  () => import("@/components/documents/documents-editor"),
  { ssr: false },
);

type PublicPageProps = {
  params: {
    docId: string;
  };
};

export default async function PublicDocumentPage({
  params: { docId },
}: PublicPageProps) {
  if (!docId) {
    redirect("/");
  }

  const doc = await db.document.findUnique({
    where: { id: docId },
  });

  if (!doc || !doc.public) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-y-4 w-full items-start py-10 px-16">
      <h2 className="text-zinc-600 text-4xl font-bold px-[54px]">
        {doc.title}
      </h2>
      <ValidateMount>
        <DocumentsEditor
          editable={false}
          initialContent={doc.content ?? undefined}
        />
      </ValidateMount>
    </div>
  );
}
