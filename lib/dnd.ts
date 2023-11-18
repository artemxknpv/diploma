import { OnDragEndResponder } from "@hello-pangea/dnd";
import { ListWithCards } from "@/prisma/types";
import { Card } from "@prisma/client";

export function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const createDragEndHandler =
  (
    orderedLists: ListWithCards[],
    onFinish: (
      updatedEntity: "card" | "list",
      reorderedLists: ListWithCards[],
      reorderedCards: Card[],
    ) => void,
  ): OnDragEndResponder =>
  (result) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // if dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "list") {
      const items = reorder(orderedLists, source.index, destination.index).map(
        (item, index) => ({ ...item, order: index }),
      );

      return onFinish(type, items, []);
    }

    // user moves card
    if (type === "card") {
      const newOrderedList = [...orderedLists];
      const sourceList = newOrderedList.find(
        (l) => l.id === source.droppableId,
      );

      const destList = newOrderedList.find(
        (l) => l.id === destination.droppableId,
      );

      if (!sourceList || !destList) {
        return;
      }

      if (!sourceList.cards) {
        sourceList.cards = [];
      }
      if (!destList.cards) {
        destList.cards = [];
      }

      // moving card within a list
      if (source.droppableId === destination.droppableId) {
        sourceList.cards = reorder(
          sourceList.cards,
          source.index,
          destination.index,
        ).map((card, index) => ({ ...card, order: index }));

        onFinish(type, newOrderedList, sourceList.cards);
      } else {
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        movedCard.listId = destination.droppableId;
        destList.cards.splice(destination.index, 0, movedCard);

        sourceList.cards.forEach((card, index) => {
          card.order = index;
        });

        //   update the order for each card in the destination list
        destList.cards.forEach((card, index) => {
          card.order = index;
        });

        onFinish(type, newOrderedList, destList.cards);
      }
    }
  };
