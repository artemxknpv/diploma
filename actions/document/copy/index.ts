"use server";

import { InputType, ReturnType } from "./types";
import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { createSafeAction } from "@/lib/create-safe-action";
import { CopyDocumentSchema } from "@/actions/document/copy/schema";
import { Document } from "@prisma/client";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { orgId } = auth();
  const user = await currentUser();

  if (!user || !orgId) {
    return {
      error: "Unauthorized",
    };
  }

  const { ids, parentId } = data;

  try {
    const originalDocs = await db.document.findMany({
      where: { id: { in: ids }, orgId },
    });

    if (!originalDocs.length) {
      return { error: "Original document not found" };
    }

    const { filesToCopy } = originalDocs.reduce(
      (acc, cur) => {
        if (cur.isFolder) {
          acc.foldersToCopy.push(cur);
        } else {
          acc.filesToCopy.push(cur);
        }

        return acc;
      },
      { filesToCopy: [] as Document[], foldersToCopy: [] as Document[] },
    );

    let copiedFiles: Document[] = [];
    if (filesToCopy.length) {
      const transactionCopy = originalDocs.map((doc) =>
        db.document.create({
          data: {
            title: `${doc.title} - COPY`,
            content: doc.content,
            authorId: user.id,
            parentId,
            orgId,
            isFolder: doc.isFolder,
          },
        }),
      );
      copiedFiles = await db.$transaction(transactionCopy);
    }

    revalidatePath(`/organization/${orgId}/documents`);
    return { data: copiedFiles };
  } catch (e) {
    return {
      error: "Failed to copy",
    };
  }
};

export const copyDocument = createSafeAction(CopyDocumentSchema, handler);
