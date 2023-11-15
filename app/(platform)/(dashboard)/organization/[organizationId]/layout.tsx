import { PropsWithChildren } from "react";
import { OrgControl } from "./_components/org-control";

export default function OrganizationPageLayout({
  children,
}: PropsWithChildren) {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
}
