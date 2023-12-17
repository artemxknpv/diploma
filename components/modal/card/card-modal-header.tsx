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
import { CardHeaderUser } from "@/components/modal/card/card-header-user";
import { CardSelectOwner } from "@/components/modal/card/card-select-owner";
import { Button } from "@/components/ui/button";

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
      toast.success(`Карточка "${data.title}" обновлена`);
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
      <div className="grid md:grid-cols-4 gap-4 grid-cols-1 w-full">
        <div className="md:col-span-3">
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
        <div className="gap-y-2 gap-x-4 flex-col flex flex-grow">
          <CardHeaderUser
            imageSrc={card.authorImage}
            title="автор"
            userName={card.authorName}
          />
          <CardSelectOwner card={card}>
            <Button
              variant="ghost"
              className="w-full p-0 hover:bg-transparent font-normal h-auto"
              textAlign="left"
            >
              <CardHeaderUser
                title="владелец"
                userName={card.ownerName ?? "Нет владельца"}
                imageSrc={card.ownerImage}
              />
            </Button>
          </CardSelectOwner>
        </div>
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
