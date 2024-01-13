import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import { MobileSidebar } from "./mobile-sidebar";
import { FormPopover } from "@/components/form/form-popover";
import { Logo } from "@/components/logo";

export function Navbar() {
  return (
    <nav className="fixed z-50 top-0 px-4 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <div className="flex items-center gap-x-4">
        <MobileSidebar />
        <div className="hidden md:flex">
          <Logo />
        </div>
        <FormPopover align="start" side="bottom" sideOffset={16}>
          <Button
            size="sm"
            className="rounded-sm hidden md:block h-auto py-1.5 px-2"
          >
            Создать таблицу
          </Button>
        </FormPopover>
        <FormPopover align="start" side="bottom" sideOffset={16}>
          <Button size="sm" className="rounded-sm block md:hidden">
            <PlusIcon className="w-4 h-4" />
          </Button>
        </FormPopover>
      </div>
      <div className="flex items-center gap-x-2 ml-auto">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterSelectOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          appearance={ORG_SWITCHER_APPEARANCE}
        />
        <UserButton afterSignOutUrl="/" appearance={USER_BTN_APPEARANCE} />
      </div>
    </nav>
  );
}

const ORG_SWITCHER_APPEARANCE = {
  elements: {
    rootBox: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  },
};

const USER_BTN_APPEARANCE = {
  elements: {
    avatarBox: {
      height: 30,
      width: 30,
    },
  },
};
