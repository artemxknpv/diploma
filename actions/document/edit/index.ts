"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { EditDocumentSchema } from "./schema";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { documents } = data;

  try {
    const updatedDocs = await db.$transaction(
      documents.map((d) =>
        db.document.update({
          where: { orgId, id: d.id },
          data: { title: d.title, content: d.content },
        }),
      ),
    );

    // createAuditLog({
    //   action: ACTION.CREATE,
    //   entityTitle: document.title,
    //   entityId: document.id,
    //   entityType: ENTITY_TYPE.DOCUMENT,
    // });

    revalidatePath(`/organization/${orgId}/documents`);
    return { data: updatedDocs };
  } catch (e) {
    return {
      error: "Failed to create",
    };
  }
};

export const editDocument = createSafeAction(EditDocumentSchema, handler);
