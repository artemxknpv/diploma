"use client";

import { create, State } from "@/actions/board/create-board";
import { useFormState } from "react-dom";
import { FormInput } from "./form-input";
import { FormButton } from "./form-button";

const initialState: State = { message: null, errors: {} };

export function Form() {
  const [state, dispatch] = useFormState(create, initialState);

  return (
    <form action={dispatch}>
      <FormInput errors={state?.errors} />
      <FormButton />
    </form>
  );
}
