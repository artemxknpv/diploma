"use client";

import { FC, PropsWithChildren } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FileIcon, FolderIcon } from "lucide-react";
import { useDocumentNameModal } from "@/hooks/documents/use-document-name-modal";

type DocumentContextMenuItem = {
  label: string;
  onClick: () => void;
  icon?: FC<{ className?: string }>;
};

type DocumentsContextMenuProps = PropsWithChildren;

export function DocumentsContextMenu({ children }: DocumentsContextMenuProps) {
  const menuItems = useDocumentContextMenu();

  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent>
        {menuItems.map(({ icon: Icon, ...item }) => (
          <ContextMenuItem onClick={item.onClick} key={item.label} asChild>
            <div className="flex gap-x-2 items-center">
              {Icon && <Icon className="w-4 h-4" />}
              {item.label}
            </div>
          </ContextMenuItem>
        ))}
      </ContextMenuContent>
    </ContextMenu>
  );
}

export function useDocumentContextMenu() {
  const openModal = useDocumentNameModal((s) => s.onOpen);

  const menuItems: DocumentContextMenuItem[] = [
    {
      onClick: () => openModal({ isFolder: false }),
      label: "Создать документ",
      icon: FileIcon,
    },
    {
      onClick: () => openModal({ isFolder: true }),
      label: "Создать папку",
      icon: FolderIcon,
    },
  ];

  return menuItems;
}
