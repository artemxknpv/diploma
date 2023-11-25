import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ActivityItem } from "@/components/activity/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityIcon } from "lucide-react";

export async function ActivityList() {
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const auditLogs = await db.auditLog.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <ol className="space-y-4 mt-4">
      <div className="justify-center p-2 text-neutral-400 gap-x-2 items-center hidden last:flex">
        <ActivityIcon className="w-4 h-4" />
        <span>
          Вся активность в рамках организации будет отображаться здесь
        </span>
      </div>
      {auditLogs.map((el) => (
        <ActivityItem key={el.id} log={el} />
      ))}
    </ol>
  );
}

ActivityList.Skeleton = function ActivityListSkeleton() {
  return (
    <ol className="space-y-4 mt-4">
      <Skeleton className="w-4/5 h-14" />
      <Skeleton className="w-1/2 h-14" />
      <Skeleton className="w-2/3 h-14" />
      <Skeleton className="w-4/5 h-14" />
      <Skeleton className="w-3/4 h-14" />
    </ol>
  );
};
