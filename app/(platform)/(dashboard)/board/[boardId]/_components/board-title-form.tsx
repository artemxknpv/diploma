"use client";

import { Board } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { ElementRef, useRef, useState } from "react";
import { TextField } from "@/components/form/text-field";
import { useAction } from "@/hooks/use-action";
import { updateBoard } from "@/actions/board/update";
import { toast } from "sonner";

type BoardTitleFormProps = {
  board: Board;
};

export function BoardTitleForm({ board }: BoardTitleFormProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(board.title);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const disableEditing = () => setEditing(false);

  const { execute } = useAction(updateBoard, {
    onSuccess: ({ title }) => {
      toast.success(`Таблица "${title}" обновлена`);
      setTitle(title);
      disableEditing();
    },
    onError: toast.error,
  });

  const enableEditing = () => {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    if (title === board.title) return disableEditing();

    execute({ title, id: board.id });
  };

  const onBlur = () => {
    formRef?.current?.requestSubmit();
  };

  if (editing) {
    return (
      <form
        ref={formRef}
        action={onSubmit}
        className="flex items-center gap-x-2"
      >
        <TextField
          ref={inputRef}
          id="title"
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-2 py-1 bg-transparent  border-none focus-visible:ring-transparent focus-visible:ring-offset-0"
        />
      </form>
    );
  }

  return (
    <Button
      onClick={enableEditing}
      variant="ghost"
      className="font-bold text-lg h-auto w-auto p-1 px-2"
    >
      {title}
    </Button>
  );
}
