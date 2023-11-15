"use client";

import { useAction } from "@/hooks/use-action";
import { createBoard } from "@/actions/board/create";
import { TextField } from "@/components/form/text-field";
import { FormSubmit } from "@/components/form/form-submit";

export function Form() {
  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: () => console.log("Success"),
    onError: (e) => console.error(e),
    onComplete: () => {},
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    execute({ title });
  };

  return (
    <form action={onSubmit}>
      <TextField errors={fieldErrors} label="Board title" id="title" />
      <FormSubmit />
    </form>
  );
}
