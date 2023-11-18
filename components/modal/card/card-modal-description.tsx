import { CardWithList } from "@/prisma/types";
import { Skeleton } from "@/components/ui/skeleton";
import { AlignLeftIcon } from "lucide-react";
import { useInput } from "@/hooks/use-input";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { MutableRefObject } from "react";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/card/update";
import { toast } from "sonner";

type CardModalDescriptionProps = {
  card: CardWithList;
};

export function CardModalDescription({ card }: CardModalDescriptionProps) {
  const queryClient = useQueryClient();
  const { boardId } = useParams<{ boardId: string }>();
  const {
    inputRef,
    editing,
    disableEditing,
    enableEditing,
    formRef,
    disableOnEsc,
  } = useInput(card.description ?? "");

  const { fieldErrors, execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card", card.id] });
      toast.success(`Card "${data.title}" description updated`);
      disableEditing();
    },
    onError: toast.error,
  });

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;

    execute({ description, boardId, id: card.id });
  };

  useEventListener("keydown", disableOnEsc);
  useOnClickOutside(formRef, disableEditing);

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeftIcon className="h-5 w-5 mt-0.5 text-neutral-700" />
      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>
        {editing ? (
          <form action={onSubmit} className="space-y-2">
            <FormTextarea
              id="description"
              className="w-full mt-2"
              ref={inputRef as unknown as MutableRefObject<HTMLTextAreaElement>}
              placeholder="Card description..."
              errors={fieldErrors}
              defaultValue={card?.description ?? undefined}
            />
            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={disableEditing}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            role="button"
            onClick={enableEditing}
            className="min-h-[78px] bg-neutral-200 hover:bg-neutral-300 text-sm font-medium py-3 px-3.5 rounded-md"
          >
            {card.description || "Add a description to the card"}
          </div>
        )}
      </div>
    </div>
  );
}

CardModalDescription.Skeletion = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="w-6 h-6 bg-neutral-200" />
      <div className="w-full">
        <Skeleton className="w-24 h-6 mb-2 bg-neutral-200" />
        <Skeleton className="w-full h-[78px] bg-neutral-200" />
      </div>
    </div>
  );
};
