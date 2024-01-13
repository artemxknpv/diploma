"use server";

import { createSafeAction } from "@/lib/create-safe-action";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import { EditDocumentSchema } from "./schema";
import { createManyAuditLogs } from "@/lib/create-audit-log";
import { ACTION } from "@prisma/client";

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
          data: {
            title: d.title,
            content: d.content,
            public: d.public,
          },
        }),
      ),
    );

    createManyAuditLogs(updatedDocs, ACTION.UPDATE);
    revalidatePath(`/organization/${orgId}/documents`);

    updatedDocs.forEach((doc) => {
      if (doc.public) {
        revalidatePath(`/published/${doc.id}`);
      }
    });

    return { data: updatedDocs };
  } catch (e) {
    return {
      error: "Failed to create",
    };
  }
};

export const editDocument = createSafeAction(EditDocumentSchema, handler);
