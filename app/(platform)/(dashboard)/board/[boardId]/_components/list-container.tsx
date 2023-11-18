"use client";

import { ListWithCards } from "@/prisma/types";
import { ListForm } from "./list-form";
import { useEffect, useState } from "react";
import { ListItem } from "./list-item";

type ListContainerProps = {
  lists: ListWithCards[];
  boardId: string;
};

export function ListContainer({ lists, boardId }: ListContainerProps) {
  const [orderedLists, setOrderedLists] = useState(lists);

  useEffect(() => {
    setOrderedLists(lists);
  }, [lists]);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedLists.map((list, index) => (
        <ListItem key={list.id} index={index} list={list} />
      ))}
      <ListForm />
      <div className="flex-shrink-0 w-1"></div>
    </ol>
  );
}
