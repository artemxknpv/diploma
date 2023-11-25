import { List } from "@prisma/client";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { FormSubmit } from "@/components/form/form-submit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/use-action";
import { deleteList } from "@/actions/list/delete";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";
import { copyList } from "@/actions/list/copy";

type ListOptionsProps = {
  list: List;
  onAddCard: () => void;
};

export function ListActions({ list, onAddCard }: ListOptionsProps) {
  const closeRef = useRef<ElementRef<"button">>(null);
  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} was created`);
      closeRef.current?.click();
    },
    onError: toast.error,
  });

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} was deleted`);
      closeRef.current?.click();
    },
    onError: toast.error,
  });

  const handleForm = (execute: typeof executeCopy) => (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    execute({ boardId, id });
  };

  const onCopyList = handleForm(executeCopy);
  const onDeleteList = handleForm(executeDelete);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontalIcon className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="px-0 py-3 border-none"
        side="bottom"
        align="start"
      >
        <div className="text-base font-medium text-center pb-4">Действия</div>
        <PopoverClose asChild ref={closeRef}>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <Button
          onClick={onAddCard}
          className="rounded-none w-full font-normal py-1"
          textAlign="left"
          variant="ghost"
          size="sm"
        >
          Создать карточку
        </Button>
        <form action={onCopyList}>
          <input readOnly hidden id="id" name="id" value={list.id} />
          <input
            readOnly
            hidden
            id="boardId"
            name="boardId"
            value={list.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full font-normal py-1"
            textAlign="left"
          >
            Копировать колонку
          </FormSubmit>
        </form>
        <Separator className="my-2" />
        <form action={onDeleteList}>
          <input readOnly hidden id="id" name="id" value={list.id} />
          <input
            readOnly
            hidden
            id="boardId"
            name="boardId"
            value={list.boardId}
          />
          <FormSubmit
            variant="ghost"
            className="rounded-none w-full py-1 text-rose-500 hover:text-white hover:bg-rose-500"
            textAlign="left"
          >
            Удалить колонку
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
}
