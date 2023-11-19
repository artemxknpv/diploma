"use server";

import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CreateCardSchema } from "@/actions/card/create/schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, boardId, listId } = data;

  let card;
  try {
    const list = await db.list.findUnique({
      where: {
        id: listId,
        board: { orgId },
      },
    });

    if (!list) {
      return { error: "List not found" };
    }

    const lastCardOrder =
      (
        await db.card.findFirst({
          where: { listId },
          orderBy: { order: "desc" },
          select: { order: true },
        })
      )?.order ?? 0;

    const newOrder = lastCardOrder + 1;

    card = await db.card.create({
      data: { title, listId, order: newOrder },
    });

    await createAuditLog({
      entityType: ENTITY_TYPE.CARD,
      action: ACTION.CREATE,
      entityId: card.id,
      entityTitle: card.title,
    });
  } catch (e) {
    return {
      error: "Failed to create list",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: card };
};

export const createCard = createSafeAction(CreateCardSchema, handler);
