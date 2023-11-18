import { ElementRef, forwardRef, KeyboardEventHandler, useRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { FormTextarea } from "@/components/form/form-textarea";
import { FormSubmit } from "@/components/form/form-submit";
import { useParams } from "next/navigation";
import { useEventListener } from "usehooks-ts";
import { useAction } from "@/hooks/use-action";
import { createCard } from "@/actions/card/create";
import { toast } from "sonner";

type CardFormProps = {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  onKeyDown: (e: KeyboardEvent) => void;
  editing: boolean;
};

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  function CardFormBase(
    { disableEditing, editing, enableEditing, listId, onKeyDown },
    ref,
  ) {
    const { boardId } = useParams<{ boardId: string }>();
    const formRef = useRef<ElementRef<"form">>();

    useEventListener("keydown", onKeyDown);

    const { execute, fieldErrors } = useAction(createCard, {
      onError: toast.error,
      onSuccess: ({ title }) =>
        toast.success(`Card ${title} was successfully created`),
    });

    const onTextareaKeydown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e,
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = formData.get("boardId") as string;

      console.log({ listId, boardId, title });

      execute({ title, listId, boardId });
    };

    if (editing) {
      return (
        <form action={onSubmit} className="flex flex-col gap-y-2">
          <FormTextarea
            id="title"
            onKeyDown={onTextareaKeydown}
            ref={ref}
            errors={fieldErrors}
            placeholder="Enter a title for this card"
          />
          <input hidden id="listId" name="listId" value={listId} readOnly />
          <input hidden id="boardId" name="boardId" value={boardId} readOnly />
          <div className="flex items-center gap-x-2">
            <FormSubmit>Add card</FormSubmit>
            <Button onClick={disableEditing} size="sm" variant="ghost">
              <XIcon className="w-4 h-4" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div>
        <Button
          onClick={enableEditing}
          className="h-auto w-full justify-start text-sm text-muted-foreground gap-x-2 py-2"
          size="sm"
          variant="ghost"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add a card</span>
        </Button>
      </div>
    );
  },
);
