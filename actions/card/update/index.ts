"use server";

import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { UpdateCardSchema } from "@/actions/card/update/schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { id, boardId, ...rest } = data;
  let card;
  try {
    card = await db.card.update({
      where: {
        id,
        list: { board: { orgId } },
      },
      data: rest,
    });
  } catch (e) {
    return {
      error: "Failed to update",
    };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: card };
};

export const updateCard = createSafeAction(UpdateCardSchema, handler);
