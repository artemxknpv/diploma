import { PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { BoardNavbar } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/board-navbar";

export async function generateMetadata({
  params: { boardId },
}: {
  params: { boardId: string };
}) {
  const { orgId } = auth();
  if (!orgId) {
    return {
      title: "Board",
    };
  }

  const board = await db.board.findUnique({
    where: { id: boardId, orgId },
  });

  return { title: board?.title ?? "Board" };
}

export default async function BoardIdLayout({
  children,
  params: { boardId },
}: PropsWithChildren<{ params: { boardId: string } }>) {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const board = await db.board.findUnique({
    where: { id: boardId, orgId },
  });

  if (!board) {
    notFound();
  }

  return (
    <div
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
      className="relative h-full w-full bg-no-repeat bg-cover bg-center"
    >
      <BoardNavbar board={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full w-full">{children}</main>
    </div>
  );
}
