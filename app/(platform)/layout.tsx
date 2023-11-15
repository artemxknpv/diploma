import { ClerkProvider } from "@clerk/nextjs";
import { PropsWithChildren } from "react";
import { ruRU } from "@clerk/localizations";

export default function PlatformLayout({ children }: PropsWithChildren) {
  return <ClerkProvider localization={ruRU}>{children}</ClerkProvider>;
}
