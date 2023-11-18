import { PropsWithChildren } from "react";

export function ListWrapper({ children }: PropsWithChildren) {
  return <li className="shrink-0 h-full w-[272px] select-none">{children}</li>;
}
