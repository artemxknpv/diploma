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

  const getDocs = () => {
    if (searchParams.file) {
      return db.document.findMany({
        where: { orgId, id: searchParams.file },
      });
    }

    if (searchParams.folder) {
      return db.document.findMany({
        where: { orgId, parentId: searchParams.folder },
      });
    }

    return db.document.findMany({
      where: { orgId, parentId: null },
    });
  };

  const documents = await getDocs();

  return (
    <div className="w-full grow flex flex-col mb-20">
      <Info />
      <Separator className="my-4" />
      <div className="grow flex">
        <Suspense>
          <DocumentList documents={documents} />
        </Suspense>
      </div>
    </div>
  );
}
