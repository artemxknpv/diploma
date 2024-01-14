"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { CardWithList } from "@/prisma/types";

export const getCardData = (cardId: string) => {
  const { userId, orgId } = auth();

  if (!userId || !orgId) {
    return null;
  }

  return db.card.findUnique({
    where: {
      id: cardId,
      list: {
        board: { orgId },
      },
    },
    include: {
      list: {
        select: {
          title: true,
        },
      },
    },
  }) as Promise<CardWithList | null>;
};
