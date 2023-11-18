"use client";

import { ListWithCards } from "@/prisma/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { createDragEndHandler } from "@/lib/dnd";
import { useAction } from "@/hooks/use-action";
import { updateListOrder } from "@/actions/list/update-order";
import { toast } from "sonner";
import { updateCardOrder } from "@/actions/card/update-order";

type ListContainerProps = {
  lists: ListWithCards[];
  boardId: string;
};

export function ListContainer({ lists, boardId }: ListContainerProps) {
  const [orderedLists, setOrderedLists] = useState(lists);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onError: toast.error,
    onSuccess: () => toast.success("Lists reordered"),
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onError: toast.error,
    onSuccess: () => toast.success("Cards reordered"),
  });

  useEffect(() => {
    setOrderedLists(lists);
  }, [lists]);

  return (
    <DragDropContext
      onDragEnd={createDragEndHandler(
        lists,
        (updatedEntity, reorderedLists, reorderedCards) => {
          setOrderedLists(reorderedLists);
          if (updatedEntity === "list") {
            executeUpdateListOrder({ boardId, items: reorderedLists });
          }
          if (updatedEntity === "card") {
            executeUpdateCardOrder({ boardId, items: reorderedCards });
          }
        },
      )}
    >
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex gap-x-3 h-full"
          >
            {orderedLists.map((list, index) => (
              <ListItem key={list.id} index={index} list={list} />
            ))}
            {provided.placeholder}
            <ListForm />
            <div className="flex-shrink-0 w-1" />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
