import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";

type CardItemProps = {
  card: Card;
  index: number;
};

export function CardItem({ card, index }: CardItemProps) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          role="button"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className="truncate border-2 border-transparent hover:shadow-md py-2 px-3 text-sm rounded-md bg-white hover:bg-white shadow-sm w-full font-normal transition-shadow"
        >
          {card.title}
        </div>
      )}
    </Draggable>
  );
}
