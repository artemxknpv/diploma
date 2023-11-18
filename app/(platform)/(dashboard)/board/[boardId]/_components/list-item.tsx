"use client";

import { ListHeader } from "./list-header";
import { useInput } from "@/hooks/use-input";
import { CardForm } from "./card-form";
import { MutableRefObject } from "react";
import { ListWithCards } from "@/prisma/types";
import { CardItem } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/card-item";

type ListItemProps = {
  index: number;
  list: ListWithCards;
};

export function ListItem({ index, list }: ListItemProps) {
  const { enableEditing, editing, disableEditing, inputRef, disableOnEsc } =
    useInput("");

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-neutral-100 shadow-md p-2 flex flex-col gap-y-2">
        <ListHeader onAddCard={enableEditing} list={list} />
        <ol>
          {list.cards.map((card, index) => (
            <CardItem index={index} key={card.id} card={card} />
          ))}
        </ol>
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
  );
}
