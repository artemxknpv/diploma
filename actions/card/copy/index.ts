"use server";

import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyListSchema } from "@/actions/list/copy/schema";
import { CopyCardSchema } from "@/actions/card/copy/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId } = data;
  let card;
  try {
    const originalCard = await db.card.findUnique({
      where: { id, list: { board: { orgId } } },
    });

    if (!originalCard) {
      return { error: "Original card not found" };
    }

    const lastCard =
      (
        await db.card.findFirst({
          where: { id, listId: originalCard.listId },
          orderBy: { order: "desc" },
          select: { order: true },
        })
      )?.order ?? 0;

    card = await db.card.create({
      data: {
        title: `${originalCard.title} - COPY`,
        description: originalCard.description,
        order: lastCard + 1,
        listId: originalCard.listId,
      },
    });
  } catch (e) {
    return {
      error: "Failed to copy",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const copyCard = createSafeAction(CopyCardSchema, handler);
