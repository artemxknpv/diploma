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
    <div className="font-semibold min-h-[44px] flex justify-between items-center gap-x-2 w-full  min-w-0">
      {editing ? (
        <form action={onSubmit} ref={formRef} className="flex-1 pl-2 py-2">
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
            className="px-1"
            placeholder="Enter a new title for the list..."
            defaultValue={title}
          />
          <button hidden />
        </form>
      ) : (
        <div
          role="button"
          title={title}
          onClick={enableEditing}
          className="mt-0.5 flex-grow text-sm pl-3.5 pr-2 border-transparent flex font-semibold truncate"
        >
          {title}
        </div>
      )}
      <ListActions list={list} onAddCard={onAddCard} />
    </div>
  );
}
