"use client";

import { useLocalStorage } from "usehooks-ts";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Accordion } from "@/components/ui/accordion";
import { NavItem } from "@/app/(platform)/(dashboard)/_components/nav-item";

type SidebarProps = {
  storageKey?: string;
};

export function Sidebar({ storageKey = "d-sidebar-state" }: SidebarProps) {
  const [expanded, setExpanded] = useLocalStorage<Record<string, boolean>>(
    storageKey,
    {},
  );

  const { organization: activeOrg, isLoaded: orgLoaded } = useOrganization();
  const { userMemberships, isLoaded: orgListLoaded } = useOrganizationList({
    userMemberships: { infinite: true },
  });

  const defaultAccordionValue = Object.keys(expanded).filter(
    (key) => expanded[key],
  );

  const onExpand = (id: string) => {
    setExpanded((p) => ({ ...p, [id]: !expanded[id] }));
  };

  if (!orgListLoaded || !orgLoaded || userMemberships.isLoading) {
    return <Sidebar.Skeleton />;
  }

  return (
    <aside>
      <div className="font-medium flex items-center mb-1">
        <span className="pl-4">Workspaces</span>
        <Button
          asChild
          type="button"
          className="ml-auto"
          variant="ghost"
          size="icon"
        >
          <Link href="/select-org">
            <Plus className="w-4 h-4" />
          </Link>
        </Button>
      </div>
      <Accordion
        type="multiple"
        defaultValue={defaultAccordionValue}
        className="space-y-2"
      >
        {userMemberships.data.map(({ organization }) => (
          <NavItem
            key={organization.id}
            active={activeOrg?.id === organization.id}
            organization={organization}
            expanded={expanded[organization.id]}
            onExpand={() => onExpand(organization.id)}
          >
            {organization.name}
          </NavItem>
        ))}
      </Accordion>
    </aside>
  );
}

Sidebar.Skeleton = function SidebarSkeleton() {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-10" />
      </div>
      <div className="space-y-2">
        <NavItem.Skeleton />
        <NavItem.Skeleton />
        <NavItem.Skeleton />
      </div>
    </>
  );
};
