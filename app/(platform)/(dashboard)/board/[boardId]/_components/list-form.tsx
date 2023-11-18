"use client";

import { ListWrapper } from "./list-wrapper";
import { PlusIcon, XIcon } from "lucide-react";
import { ElementRef, useRef, useState } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { TextField } from "@/components/form/text-field";
import { useParams, useRouter } from "next/navigation";
import { FormSubmit } from "@/components/form/form-submit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { createList } from "@/actions/list/create";
import { toast } from "sonner";

export function ListForm() {
  const router = useRouter();
  const { boardId } = useParams<{ boardId: string }>();
  const [editing, setEditing] = useState(false);

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const enableEditing = () => {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => setEditing(false);

  const { execute, loading, fieldErrors } = useAction(createList, {
    onError: toast.error,
    onSuccess: ({ title }) => {
      toast.success(`List "${title}" was successfully created`);
      disableEditing();
      router.refresh();
    },
  });

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    execute({ boardId, title });
  };

  if (editing) {
    return (
      <ListWrapper>
        <form
          action={onSubmit}
          ref={formRef}
          className="w-full p-3 rounded-md bg-white space-y-4 shadow-md"
        >
          <TextField
            errors={fieldErrors}
            id="title"
            ref={inputRef}
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter list title"
          />
          <input hidden value={boardId} readOnly name="boardId" />
          <div className="flex items-center gap-x-2">
            <FormSubmit>Create list</FormSubmit>
            <Button
              disabled={loading}
              onClick={disableEditing}
              size="sm"
              variant="ghost"
            >
              Cancel
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex items-center font-medium text-sm gap-x-2"
      >
        <PlusIcon className="h-4 w-4" />
        <span>Add a list</span>
      </button>
    </ListWrapper>
  );
}
