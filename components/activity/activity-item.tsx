import { AuditLog } from "@prisma/client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { generateLogMessage } from "@/lib/generate-log-message";
import { formatRu } from "@/lib/date";

type ActivityItemProps = {
  log: AuditLog;
};

export function ActivityItem({ log }: ActivityItemProps) {
  return (
    <li className="flex items-center gap-x-2">
      <Avatar>
        <AvatarImage src={log.userImage} />
      </Avatar>
      <div className="flex flex-col gap-y-0.5 items-start">
        <div className="text-sm space-x-1.5">
          <span className="font-semibold lowercase text-neutral-700">
            {log.userName}
          </span>
          <span>{generateLogMessage(log)}</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {formatRu(log.createdAt, "MMM d, yyyy 'в' HH:mm")}
        </span>
      </div>
    </li>
  );
}
