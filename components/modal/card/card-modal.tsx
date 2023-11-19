import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/use-card-modal";
import { useQuery } from "@tanstack/react-query";
import { CardWithList } from "@/prisma/types";
import { fetcher } from "@/lib/fetcher";
import { CardModalHeader } from "@/components/modal/card/card-modal-header";
import { CardModalDescription } from "@/components/modal/card/card-modal-description";
import { CardModalToolbar } from "@/components/modal/card/card-modal-toolbar";
import { AuditLog } from "@prisma/client";
import { CardActivity } from "@/components/modal/card/card-activity";

export function CardModal() {
  const id = useCardModal((s) => s.id);
  const open = useCardModal((s) => s.open);
  const onClose = useCardModal((s) => s.onClose);

  const { data: cardData, isLoading } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/card/${id}`),
  });

  const { data: cardLogs } = useQuery<AuditLog[]>({
    queryKey: ["card-log", id],
    queryFn: () => fetcher(`/api/card/${id}/logs`),
  });

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent>
        {isLoading || !cardData ? (
          <CardModalHeader.Skeleton />
        ) : (
          <CardModalHeader card={cardData} />
        )}
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <CardModalDescription.Skeletion />
              ) : (
                <CardModalDescription card={cardData} />
              )}
              {!cardLogs ? (
                <CardActivity.Skeleton />
              ) : (
                <CardActivity logs={cardLogs} />
              )}
            </div>
          </div>
          {!cardData ? (
            <CardModalToolbar.Skeleton />
          ) : (
            <CardModalToolbar card={cardData} />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
