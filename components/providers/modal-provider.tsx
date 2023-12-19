"use client";

import { useMounted } from "@/hooks/use-mounted";
import { CardModal } from "@/components/modal/card/card-modal";
import { DocumentNameModal } from "@/components/modal/document/document-name-modal";

export function ModalProvider() {
  const mounted = useMounted();

  if (!mounted) return null;

  return (
    <>
      <CardModal />
      <DocumentNameModal />
    </>
  );
}
