"use client";

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";

export function FormButton() {
  const { pending } = useFormStatus();
  return <Button disabled={pending}>Submit</Button>;
}
