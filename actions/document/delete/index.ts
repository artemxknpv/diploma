"use server";

import { InputType, ReturnType } from "./types";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { DeleteDocumentSchema } from "./schema";
import { redirect } from "next/navigation";
import { createManyAuditLogs } from "@/lib/create-audit-log";
import { ACTION } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { ids } = data;
  try {
    const entitiesToDelete = await db.document.findMany({
      where: { orgId, id: { in: ids } },
    });

    const noFoldersToDelete = entitiesToDelete.every((e) => !e.isFolder);

    if (noFoldersToDelete) {
      const deleteTransaction = entitiesToDelete.map(({ id }) =>
        db.document.delete({
          where: { orgId, id },
        }),
      );

      const data = await db.$transaction(deleteTransaction);
      createManyAuditLogs(data, ACTION.DELETE);

      revalidatePath(`/organization/${orgId}/documents`);
      return { data };
    }

    const idsToDelete = [...ids];
    const deleteQueue = [...ids];

    while (true) {
      const currentParentId = deleteQueue.shift();
      if (!currentParentId) break;

      const currentParentChildren = (
        (await db.document.findMany({
          where: { orgId, parentId: currentParentId },
        })) ?? []
      ).map((el) => el.id);
      idsToDelete.push(...currentParentChildren);
      deleteQueue.push(...currentParentChildren);
    }

    const deleteTransaction = idsToDelete.map((id) =>
      db.document.delete({
        where: { id, orgId },
      }),
    );

    const deletedItems = await db.$transaction(deleteTransaction);
    createManyAuditLogs(deletedItems, ACTION.DELETE);

    revalidatePath(`/organization/${orgId}/documents`);
    try {
      redirect(`/organization/${orgId}/documents`);
    } catch {
      return { data: deletedItems };
    }
  } catch (e) {
    console.error("Error while deleting document", { e });
    return {
      error: "Failed to delete",
    };
  }
};

export const deleteDocument = createSafeAction(DeleteDocumentSchema, handler);
