"use client";

import { ElementRef, PropsWithChildren, useRef } from "react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { TextField } from "@/components/form/text-field";
import { FormSubmit } from "@/components/form/form-submit";
import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/board/create";
import { toast } from "sonner";
import { FormPicker } from "@/components/form/form-picker";
import { useRouter } from "next/navigation";

type FormPopoverProps = {
  side?: "left" | "right" | "top" | "bottom";
  align?: "start" | "center" | "end";
  sideOffset?: number;
};

export function FormPopover({
  children,
  ...popoverProps
}: PropsWithChildren<FormPopoverProps>) {
  const router = useRouter();
  const closeIconRef = useRef<ElementRef<"button">>(null);

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success(`Таблица "${data.title}" успешно создана`);
      closeIconRef.current?.click();
      router.push(`/board/${data.id}`);
    },
    onError: (e) => {
      toast.error(e);
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    execute({ title, image });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-80 pt-3" {...popoverProps}>
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Создать таблицу
        </div>
        <PopoverClose asChild ref={closeIconRef}>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <XIcon className="h-4 w-4" />
          </Button>
        </PopoverClose>
        <form action={onSubmit}>
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <TextField
              errors={fieldErrors}
              id="title"
              label="Название таблицы"
              type="text"
            />
            <FormSubmit className="w-full">Создать</FormSubmit>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
