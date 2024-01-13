"use client";

import { PropsWithChildren } from "react";
import { useMounted } from "@/hooks/use-mounted";

export function ValidateMount({ children }: PropsWithChildren) {
  const mounted = useMounted();

  if (!mounted) return null;

  return children;
}
