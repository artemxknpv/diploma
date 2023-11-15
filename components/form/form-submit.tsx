"use client";

import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

type FormSubmitProps = Pick<
  ComponentProps<typeof Button>,
  "variant" | "children" | "disabled" | "className"
>;

export function FormSubmit({ disabled, ...props }: FormSubmitProps) {
  const { pending } = useFormStatus();

  return (
    <Button {...props} size="sm" type="submit" disabled={pending || disabled} />
  );
}