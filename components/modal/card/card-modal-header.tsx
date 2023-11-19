"use client";
import { CardWithList } from "@/prisma/types";
import { LayoutIcon } from "lucide-react";
import { useInput } from "@/hooks/use-input";
import { TextField } from "@/components/form/text-field";
import { Skeleton } from "@/components/ui/skeleton";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/card/update";
import { toast } from "sonner";

type CardModalHeaderProps = {
  card: CardWithList;
};

export function CardModalHeader({ card }: CardModalHeaderProps) {
  const {
    inputValue: title,
    inputRef,
    setInputValue,
    onBlur,
    disableEditing,
  } = useInput(card.title);
  const queryClient = useQueryClient();
  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" updated successfully`);
      queryClient.invalidateQueries({ queryKey: ["card", card.id] });
      queryClient.invalidateQueries({ queryKey: ["card-log", card.id] });
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
      setInputValue(card.title);
    },
  });

  const params = useParams<{ boardId: string }>();

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    if (title === card.title) return disableEditing();

    const boardId = params.boardId;
    execute({ boardId, title, id: card.id });
    setInputValue(title);
  };

  return (
    <div className="flex items-start gap-x-3 mb-6 w-full">
      <LayoutIcon className="h-5 w-5 mt-1 text-neutral-700" />
      <div className="w-full">
        <form action={onSubmit}>
          <TextField
            errors={fieldErrors}
            ref={inputRef}
            defaultValue={title}
            id="title"
            onBlur={onBlur}
            className="font-semibold text-xl px-1 text-neutral-700 bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-white focus-visible:border-input mb-0.5 truncate"
          />
        </form>
        <p className="text-sm text-muted-foreground">
          in list <span className="underline">{card.list.title}</span>
        </p>
      </div>
    </div>
  );
}

CardModalHeader.Skeleton = function HeaderSkeleton() {
  return (
    <div className="flex items-start gap-x-3 mx-6">
      <Skeleton className="h-6 w-6 mt-1 bg-neutral-200" />
      <div>
        <Skeleton className="h-6 w-24 mb-1 bg-neutral-200" />
        <Skeleton className="h-6 w-12 bg-neutral-200" />
      </div>
    </div>
  );
};
