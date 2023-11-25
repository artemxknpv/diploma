import { PropsWithChildren } from "react";
import { OrganizationResource } from "@clerk/types";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib";
import Image from "next/image";
import { Activity, Layout, Settings, StickyNoteIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type NavItemProps = PropsWithChildren<{
  active: boolean;
  expanded: boolean;
  organization: OrganizationResource;
  onExpand: () => void;
}>;

export function NavItem({
  onExpand,
  expanded,
  active,
  organization,
}: NavItemProps) {
  const router = useRouter();
  const pathname = usePathname();

  const onClick = (href: string) => router.push(href);

  const routes = [
    {
      label: "Таблицы",
      icon: <Layout className="h-4 w-4" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: "Документы",
      icon: <StickyNoteIcon className="h-4 w-4" />,
      href: `/organization/${organization.id}/documents`,
    },
    {
      label: "Активность",
      icon: <Activity className="h-4 w-4" />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: "Настройки",
      icon: <Settings className="h-4 w-4" />,
      href: `/organization/${organization.id}/settings`,
    },
  ];

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={onExpand}
        className={cn(
          "flex items-center gap-x-2 p-1.5 text-neutral-700 hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline",
          { "bg-sky-500/10 text-sky-700": active && !expanded },
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image
              fill
              src={organization.imageUrl}
              alt="org-image"
              className="rounded-sm object-cover"
            />
          </div>
          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pt-1 text-neutral-700 space-y-2">
        {routes.map((r) => (
          <Button
            key={r.href}
            size="sm"
            variant="ghost"
            onClick={() => onClick(r.href)}
            className={cn("w-full font-normal justify-start pl-10 space-x-2", {
              "bg-sky-500/10 text-sky-700": pathname === r.href,
            })}
          >
            {r.icon}
            <span>{r.label}</span>
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

NavItem.Skeleton = function NavItemSkeleton() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="w-10 h-10 relative shrink-0">
        <Skeleton className="h-full w-full absolute" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
