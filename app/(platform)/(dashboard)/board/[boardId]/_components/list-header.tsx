"use client";

import { List } from "@prisma/client";
import { useInput } from "@/hooks/use-input";
import { useEventListener } from "usehooks-ts";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/form/text-field";
import { useAction } from "@/hooks/use-action";
import { updateList } from "@/actions/list/update";
import { toast } from "sonner";
import { ListActions } from "@/app/(platform)/(dashboard)/board/[boardId]/_components/list-actions";
import { noop } from "@/lib";

type ListHeaderProps = {
  list: List;
  onAddCard: () => void;
};

export function ListHeader({ list, onAddCard }: ListHeaderProps) {
  const {
    inputValue: title,
    setInputValue,
    inputRef,
    formRef,
    editing,
    enableEditing,
    disableEditing,
    onBlur,
    disableOnEsc,
  } = useInput(list.title);

  const { execute, fieldErrors, loading } = useAction(updateList, {
    onSuccess: ({ title }) => {
      toast.success(`List "${title}" was updated successfully`);
      disableEditing();
      setInputValue(title);
    },
    onError: toast.error,
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === list.title) return disableEditing();

    execute({ title, id, boardId });
  };

  useEventListener("keydown", disableOnEsc);

  return (
    <div className="font-semibold flex justify-between items-center gap-x-2">
      {editing ? (
        <form action={onSubmit} ref={formRef} className="flex-1 p-2">
          <input readOnly hidden id="id" name="id" value={list.id} />
          <input
            readOnly
            hidden
            id="boardId"
            name="boardId"
            value={list.boardId}
          />
          <TextField
            disabled={loading}
            errors={fieldErrors}
            onBlur={onBlur}
            ref={inputRef}
            id="title"
            placeholder="Enter a new title for the list..."
            defaultValue={title}
          />
          <button hidden />
        </form>
      ) : (
        <Button
          variant="ghost"
          textAlign="left"
          onClick={enableEditing}
          className="w-full text-sm px-4 py-1 border-transparent flex font-semibold h-full"
        >
          {title}
        </Button>
      )}
      <ListActions list={list} onAddCard={onAddCard} />
    </div>
  );
}
