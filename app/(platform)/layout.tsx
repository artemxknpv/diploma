import { ClerkProvider } from "@clerk/nextjs";
import { PropsWithChildren } from "react";
import { ruRU } from "@clerk/localizations";
import { Toaster } from "sonner";
import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";

export default function PlatformLayout({ children }: PropsWithChildren) {
  return (
    <QueryProvider>
      <ClerkProvider localization={ruRU}>
        <Toaster />
        <ModalProvider />
        {children}
      </ClerkProvider>
    </QueryProvider>
  );
}
