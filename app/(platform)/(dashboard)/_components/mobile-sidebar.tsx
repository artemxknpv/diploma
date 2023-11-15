"use client";

import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Sidebar } from "./sidebar";
import { useMounted } from "@/hooks/use-mounted";

export function MobileSidebar() {
  const pathname = usePathname();
  const mounted = useMounted();
  const { onClose, open, onOpen } = useMobileSidebar();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <Button
        onClick={onOpen}
        className="block md:hidden"
        variant="ghost"
        size="sm"
      >
        <Menu className="w-4 h-4" />
      </Button>
      <Sheet open={open} onOpenChange={onClose}>
        <SheetContent side="left" className="p-2 pt-10">
          <Sidebar storageKey="t-sidebar-mobile-state" />
        </SheetContent>
      </Sheet>
    </>
  );
}
