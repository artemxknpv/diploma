"use client";

import { useMounted } from "@/hooks/use-mounted";
import { CardModal } from "@/components/modal/card/card-modal";

export function ModalProvider() {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <>
      <CardModal />
    </>
  );
}
