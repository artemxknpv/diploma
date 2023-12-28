"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { CreateDocumentSchema } from "@/actions/document/create/schema";
import { InputType, ReturnType } from "./types";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { createAuditLog } from "@/lib/create-audit-log";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  let document;

  try {
    document = await db.document.create({
      data: {
        ...data,
        isFolder: !!data.isFolder,
        orgId,
        public: !!data.public,
      },
    });

    createAuditLog({
      action: ACTION.CREATE,
      entityTitle: document.title,
      entityId: document.id,
      entityType: ENTITY_TYPE.DOCUMENT,
    });
  } catch (e) {
    return {
      error: "Failed to create",
    };
  }

  revalidatePath(`/organization/${orgId}/documents`);
  return { data: document };
};

export const createDocument = createSafeAction(CreateDocumentSchema, handler);
