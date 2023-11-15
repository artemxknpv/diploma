"use client";

import { useFormStatus } from "react-dom";
import { Input } from "@/components/ui/input";

type FormInputProps = {
  errors?: {
    title?: string[];
  };
};

export function FormInput({ errors }: FormInputProps) {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col space-y-2">
      <Input
        name="title"
        id="title"
        required
        placeholder="Enter a board title"
        disabled={pending}
      />
      {errors?.title ? (
        <div>
          {errors.title.map((errorMessage) => (
            <p key={errorMessage} className="text-rose-500">
              {errorMessage}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
