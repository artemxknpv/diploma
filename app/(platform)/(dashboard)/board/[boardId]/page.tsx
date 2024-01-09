import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ListContainer } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-container";

type BoardIdPageProps = {
  params: { boardId: string };
};

export default async function BoardIdPage({ params }: BoardIdPageProps) {
  const lists = await getLists(params.boardId);

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer lists={lists} boardId={params.boardId} />
    </div>
  );
}

async function getLists(boardId: string) {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  return db.list.findMany({
    where: {
      boardId,
      board: { orgId },
    },
    include: {
      cards: {
        orderBy: {
          order: "asc",
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });
}
