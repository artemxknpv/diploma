import { Info } from "@/app/(platform)/(dashboard)/organization/[organizationId]/_components/info";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";

import { DocumentList } from "./_components/document-list";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

export default async function DocumentsPage({
  searchParams,
}: {
  searchParams: { folder?: string; file?: string };
}) {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const documents = await getDocs(
    orgId,
    searchParams.file,
    searchParams.folder,
  );

  return (
    <div className="w-full grow flex flex-col mb-20">
      <Info />
      <Separator className="my-4" />
      <div className="grow flex">
        <Suspense>
          <DocumentList documents={documents} params={searchParams} />
        </Suspense>
      </div>
    </div>
  );
}

const getDocs = (orgId: string, fileId?: string, parentId?: string) => {
  if (fileId) {
    return db.document.findMany({
      where: { orgId, id: fileId },
    });
  }

  return db.document.findMany({
    where: { orgId, parentId: parentId ?? null },
  });
};
