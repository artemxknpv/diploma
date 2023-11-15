"use server";

import { CreateBoardSchema } from "@/actions/board/create/schema";
import { InputType, ReturnType } from "@/actions/board/create/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId } = auth();

  if (!userId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title } = data;
  let board;

  try {
    board = await db.board.create({ data: { title } });
  } catch (e) {
    console.error(e);
    return {
      error: "Failed to create",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoardSchema, handler);
