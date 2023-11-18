"use client";

import { ListHeader } from "./list-header";
import { useInput } from "@/hooks/use-input";
import { CardForm } from "./card-form";
import { MutableRefObject } from "react";
import { ListWithCards } from "@/prisma/types";
import { CardItem } from "./card-item";
import { Draggable, Droppable } from "@hello-pangea/dnd";

type ListItemProps = {
  index: number;
  list: ListWithCards;
};

export function ListItem({ index, list }: ListItemProps) {
  const { enableEditing, editing, disableEditing, inputRef, disableOnEsc } =
    useInput("");

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className="shrink-0 h-full w-[272px] select-none"
        >
          <div
            {...provided.dragHandleProps}
            className="w-full rounded-md bg-stone-200 shadow-md p-2 flex flex-col gap-y-2"
          >
            <ListHeader onAddCard={enableEditing} list={list} />
            <Droppable droppableId={list.id} type="card">
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-2 py-1"
                >
                  {list.cards.map((card, index) => (
                    <CardItem index={index} key={card.id} card={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={list.id}
              ref={inputRef as unknown as MutableRefObject<HTMLTextAreaElement>}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
              editing={editing}
              onKeyDown={disableOnEsc}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}
