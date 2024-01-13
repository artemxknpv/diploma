"use client";

import { PropsWithChildren, ReactNode } from "react";

export function LoadSkeleton({
  fallback,
  loading,
  children,
}: PropsWithChildren<{ fallback: ReactNode; loading: boolean }>) {
  if (loading) {
    return fallback;
  }

  return children;
}
