"use client";

import { ListHeader } from "./list-header";
import { List } from "@prisma/client";
import { useInput } from "@/hooks/use-input";
import { CardForm } from "./card-form";
import { MutableRefObject } from "react";

type ListItemProps = {
  index: number;
  list: List;
};

export function ListItem({ index, list }: ListItemProps) {
  const { enableEditing, editing, disableEditing, inputRef } = useInput("");

  return (
    <li className="shrink-0 h-full w-[272px] select-none">
      <div className="w-full rounded-md bg-neutral-100 shadow-md p-2 flex flex-col gap-y-2">
        <ListHeader onAddCard={enableEditing} list={list} />
        <CardForm
          listId={list.id}
          ref={inputRef as unknown as MutableRefObject<HTMLTextAreaElement>}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
          editing={editing}
        />
      </div>
    </li>
  );
}
