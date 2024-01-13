import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { auth, currentUser } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { User } from "@clerk/backend";

type Props = {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
};

const addUserInfoToAuditLog = (p: Props, user: User, orgId: string) => {
  return {
    ...p,
    userId: user.id,
    userImage: user.imageUrl,
    orgId,
    userName:
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || "unknown",
  };
};

export async function createAuditLog(props: Props | Props[]) {
  try {
    const { orgId } = auth();
    const user = await currentUser();

    if (!user || !orgId) {
      throw new Error("User not found");
    }

    if (Array.isArray(props)) {
      return db.auditLog.createMany({
        data: props.map((p) => addUserInfoToAuditLog(p, user, orgId)),
      });
    }

    return db.auditLog.create({
      data: addUserInfoToAuditLog(props, user, orgId),
    });
  } catch (e) {
    console.log("[AUDIT_LOG_ERROR]", e);
  }
}

export const createManyAuditLogs = (
  files: Array<{ id: string; title: string }>,
  action: ACTION,
) =>
  createAuditLog(
    files.map((file) => ({
      entityId: file.id,
      entityType: ENTITY_TYPE.DOCUMENT,
      entityTitle: file.title,
      action,
    })),
  );
