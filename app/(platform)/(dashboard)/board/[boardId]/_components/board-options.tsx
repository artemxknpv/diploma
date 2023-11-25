"use client";

import { Board } from "@prisma/client";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreHorizontalIcon, XIcon } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { deleteBoard } from "@/actions/board/delete";
import { toast } from "sonner";

type BoardOptionsProps = {
  board: Board;
};

export function BoardOptions({ board }: BoardOptionsProps) {
  const { execute, loading } = useAction(deleteBoard, {
    onError: toast.error,
  });

  const onDelete = () => {
    execute({ id: board.id });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Действия с доской
        </div>
        <PopoverClose asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <XIcon className="w-4 h-4" />
          </Button>
        </PopoverClose>
        <Button
          disabled={loading}
          variant="ghost"
          onClick={onDelete}
          className="rounded-none w-full h-auto py-2 px-5 justify-start text-sm font-normal"
        >
          Удалить доску
        </Button>
      </PopoverContent>
    </Popover>
  );
}
