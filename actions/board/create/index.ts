"use server";

import { CreateBoardSchema } from "@/actions/board/create/schema";
import { InputType, ReturnType } from "@/actions/board/create/types";
import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { parseUnsplashImage } from "@/lib/unsplash";
import { createAuditLog } from "@/lib/create-audit-log";
import { ACTION, ENTITY_TYPE } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { title, image } = data;

  const {
    userName,
    id: imageId,
    thumbUrl,
    fullUrl,
    htmlLink,
  } = parseUnsplashImage(image);

  if (!userName || !imageId || !thumbUrl || !fullUrl || !htmlLink) {
    return {
      error: "Some required fields are missing. Failed to create a board",
    };
  }
  let board;

  try {
    board = await db.board.create({
      data: {
        imageFullUrl: fullUrl,
        title,
        imageId,
        imageLinkHTML: htmlLink,
        imageThumbUrl: thumbUrl,
        imageUserName: userName,
        orgId,
      },
    });

    await createAuditLog({
      action: ACTION.CREATE,
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
    });
  } catch (e) {
    return {
      error: "Failed to create",
    };
  }

  revalidatePath(`/board/${board.id}`);
  return { data: board };
};

export const createBoard = createSafeAction(CreateBoardSchema, handler);
