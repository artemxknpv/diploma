import { forwardRef } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, XIcon } from "lucide-react";
import { FormTextarea } from "@/components/form/form-textarea";
import { noop } from "@/lib";
import { FormSubmit } from "@/components/form/form-submit";

type CardFormProps = {
  listId: string;
  enableEditing: () => void;
  disableEditing: () => void;
  editing: boolean;
};

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  function CardFormBase(
    { disableEditing, editing, enableEditing, listId },
    ref,
  ) {
    if (editing) {
      return (
        <form action="" className="flex flex-col gap-y-2">
          <FormTextarea
            id="title"
            onKeyDown={noop}
            ref={ref}
            placeholder="Enter a title for this card"
          />
          <input hidden id="listId" name="listId" value={listId} readOnly />
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
          className="h-auto w-full justify-start text-sm text-muted-foreground gap-x-2"
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
