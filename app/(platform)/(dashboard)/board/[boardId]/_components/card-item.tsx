import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

type CardItemProps = {
  card: Card;
  index: number;
};

export function CardItem({ card, index }: CardItemProps) {
  const cardModal = useCardModal();

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          role="button"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={() => cardModal.onOpen(card.id)}
          className="flex justify-between border-2 border-transparent hover:shadow-md py-2 px-3 text-sm rounded-md bg-white hover:bg-white shadow-sm w-full font-normal transition-shadow gap-x-2"
        >
          <div className="max-w-4/5 truncate">{card.title}</div>
          {card.ownerId && (
            <Avatar className="w-5 h-5">
              <AvatarImage
                src={card.ownerImage ?? ""}
                className="w-5 h-5"
                asChild
              >
                <Image src={card.ownerImage ?? ""} fill alt="no image" />
              </AvatarImage>
              <AvatarFallback>-</AvatarFallback>
            </Avatar>
          )}
        </div>
      )}
    </Draggable>
  );
}
