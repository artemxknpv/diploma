import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { useCardModal } from "@/hooks/use-card-modal";

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
          className="truncate border-2 border-transparent hover:shadow-md py-2 px-3 text-sm rounded-md bg-white hover:bg-white shadow-sm w-full font-normal transition-shadow"
        >
          {card.title}
        </div>
      )}
    </Draggable>
  );
}
