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
import { LoadSkeleton } from "@/components/load-skeleton";
import { getCardData } from "@/components/modal/card/___TEST___getCardData";

export function CardModal() {
  const id = useCardModal((s) => s.id);
  const open = useCardModal((s) => s.open);
  const onClose = useCardModal((s) => s.onClose);

  const { data: cardData, isLoading } = useQuery<CardWithList | null>({
    queryKey: ["card", id],
    queryFn: () => getCardData(id!),
    enabled: !!id,
  });

  const { data: cardLogs } = useQuery<AuditLog[]>({
    queryKey: ["card-log", id],
    queryFn: () => fetcher(`/api/card/${id}/logs`),
    enabled: !!id,
  });

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent>
        <LoadSkeleton
          fallback={<CardModalHeader.Skeleton />}
          loading={!cardData || isLoading}
        >
          <CardModalHeader card={cardData!} />
        </LoadSkeleton>
        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              <LoadSkeleton
                loading={!cardData}
                fallback={<CardModalDescription.Skeleton />}
              >
                <CardModalDescription card={cardData!} />
              </LoadSkeleton>
              <LoadSkeleton
                loading={!cardLogs}
                fallback={<CardActivity.Skeleton />}
              >
                <CardActivity logs={cardLogs!} />
              </LoadSkeleton>
            </div>
          </div>
          <LoadSkeleton
            loading={!cardData}
            fallback={<CardModalToolbar.Skeleton />}
          >
            <CardModalToolbar card={cardData!} />
          </LoadSkeleton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
