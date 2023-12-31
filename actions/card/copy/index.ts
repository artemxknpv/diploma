"use server";

import { InputType, ReturnType } from "./types";
import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyCardSchema } from "@/actions/card/copy/schema";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { generateUserFullName } from "@/lib/card/generate-user-fullname";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = auth();
  const user = await currentUser();

  if (!user || !orgId) {
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
        authorName: generateUserFullName(user),
        authorImage: user.imageUrl,
        authorId: user.id,
        listId: originalCard.listId,
      },
    });

    await createAuditLog({
      action: ACTION.CREATE,
      entityTitle: card.title,
      entityId: card.id,
      entityType: ENTITY_TYPE.CARD,
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
