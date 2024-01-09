import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { folderId: string } },
) {
  try {
    const { userId, orgId } = auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const docsInFolder = await db.document.findMany({
      where: { parentId: params.folderId },
    });

    console.log({ docsInFolder });

    return NextResponse.json(docsInFolder);
  } catch (e) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
