"use server";

import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyListSchema } from "@/actions/list/copy/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let list;
  try {
    const originalList = await db.list.findUnique({
      where: { id, boardId, board: { orgId } },
      include: { cards: true },
    });

    if (!originalList) {
      return { error: "Original list not found" };
    }

    const lastList =
      (
        await db.list.findFirst({
          where: { id, boardId, board: { orgId } },
          orderBy: { order: "desc" },
        })
      )?.order ?? 0;

    list = await db.list.create({
      data: {
        title: `${originalList.title} - COPY`,
        boardId,
        order: lastList + 1,
        cards: {
          createMany: {
            data: originalList.cards.map((c) => ({
              title: c.title,
              description: c.description,
              order: c.order,
            })),
          },
        },
      },
      include: { cards: true },
    });
  } catch (e) {
    return {
      error: "Failed to copy",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: list };
};

export const copyList = createSafeAction(CopyListSchema, handler);