import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

type Breadcrumb = {
  title: string;
  id: string;
};

export async function GET(
  req: Request,
  { params }: { params: { folderId: string } },
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const currentDoc = await db.document.findUnique({
      where: { orgId, id: params.folderId },
    });
    if (!currentDoc) return NextResponse.json([]);

    const breadcrumbs: Breadcrumb[] = [
      { title: currentDoc.title, id: currentDoc.id },
    ];

    let currentParentId: string | null = currentDoc.parentId;

    while (currentParentId) {
      const parent = await db.document.findUnique({
        where: { orgId, id: currentParentId },
      });
      currentParentId = parent?.parentId ?? null;
      breadcrumbs.push({ id: parent!.id, title: parent!.title });
    }

    return NextResponse.json(breadcrumbs.reverse());
  } catch (e) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
