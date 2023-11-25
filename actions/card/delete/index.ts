"use server";

import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteCardSchema } from "@/actions/card/delete/schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

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
    card = await db.card.delete({
      where: { id, list: { board: { orgId } } },
    });

    await createAuditLog({
      action: ACTION.DELETE,
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
    });
  } catch (e) {
    return {
      error: "Failed to delete",
    };
  }

  revalidatePath(`/board/${boardId}`);
  return { data: card };
};

export const deleteCard = createSafeAction(DeleteCardSchema, handler);
