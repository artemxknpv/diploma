import { notFound, redirect } from "next/navigation";
import { DocumentsEditor } from "@/app/(platform)/(dashboard)/organization/[organizationId]/documents/_components/documents-editor";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";

type PublicPageProps = {
  params: {
    docId: string;
  };
};

export default async function PublicPage({
  params: { docId },
}: PublicPageProps) {
  const { orgId } = auth();

  if (!docId || !orgId) {
    redirect("/");
  }

  const doc = await db.document.findUnique({
    where: {
      id: docId,
      orgId,
    },
  });

  if (!doc || !doc.public) {
    return notFound();
  }

  return (
    <div className="flex flex-col gap-y-4 w-full items-start py-10 px-16">
      <h2 className="text-zinc-600 text-4xl font-bold px-[54px]">
        {doc.title}
      </h2>
      <DocumentsEditor
        editable={false}
        initialContent={doc.content ?? undefined}
      />
    </div>
  );
}
