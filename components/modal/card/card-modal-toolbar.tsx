import { Skeleton } from "@/components/ui/skeleton";
import { CardWithList } from "@/prisma/types";
import { Button } from "@/components/ui/button";
import { CopyIcon, TrashIcon } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { deleteCard } from "@/actions/card/delete";
import { copyCard } from "@/actions/card/copy";
import { useParams } from "next/navigation";
import { useCardModal } from "@/hooks/use-card-modal";
import { toast } from "sonner";

type CardModalToolbarProps = {
  card: CardWithList;
};

export function CardModalToolbar({ card }: CardModalToolbarProps) {
  const { boardId } = useParams<{ boardId: string }>();
  const closeModal = useCardModal((s) => s.onClose);

  const { execute: executeDeleteCard, loading: deletingCard } = useAction(
    deleteCard,
    {
      onSuccess: () => {
        toast.success(`Карточка "${card.title}" удалена`);
        closeModal();
      },
      onError: toast.error,
    },
  );
  const { execute: executeCopyCard, loading: copyingCard } = useAction(
    copyCard,
    {
      onSuccess: () => {
        toast.success(`Карточка "${card.title}" успешно скопирована`);
        closeModal();
      },
      onError: toast.error,
    },
  );

  const onDelete = () => executeDeleteCard({ boardId, id: card.id });
  const onCopy = () => executeCopyCard({ boardId, id: card.id });

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Действия</p>
      <Button
        className="bg-neutral-200 hover:bg-neutral-300 text-secondary-foreground w-full h-auto px-2 py-1.5 text-sm font-normal"
        textAlign="left"
        disabled={copyingCard}
        onClick={onCopy}
      >
        <CopyIcon className="h-4 w-4 mr-2" />
        Дублировать
      </Button>
      <Button
        onClick={onDelete}
        disabled={deletingCard}
        className="bg-neutral-200 hover:bg-neutral-300 text-secondary-foreground w-full h-auto px-2 py-1.5 text-sm font-normal"
        textAlign="left"
      >
        <TrashIcon className="h-4 w-4 mr-2" />
        Удалить
      </Button>
    </div>
  );
}

CardModalToolbar.Skeleton = function ToolbarSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
