import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";

type Props = {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
};

export async function createAuditLog(props: Props) {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!user || !orgId) {
      throw new Error("User not found");
    }

    await db.auditLog.create({
      data: {
        ...props,
        userId: user.id,
        userImage: user.imageUrl,
        orgId,
        userName:
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "unknown",
      },
    });
  } catch (e) {
    console.log("[AUDIT_LOG_ERROR]", e);
  }
}
