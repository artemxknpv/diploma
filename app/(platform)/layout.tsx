import { ClerkProvider } from "@clerk/nextjs";
import { PropsWithChildren } from "react";
import { ruRU } from "@clerk/localizations";
import { Toaster } from "sonner";

export default function PlatformLayout({ children }: PropsWithChildren) {
  return (
    <ClerkProvider localization={ruRU}>
      <Toaster />
      {children}
    </ClerkProvider>
  );
}
