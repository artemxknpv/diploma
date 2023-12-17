"use client";

import { FC, PropsWithChildren } from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FileIcon, FolderIcon } from "lucide-react";
import { useAction } from "@/hooks/use-action";
import { createDocument } from "@/actions/document/create";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useSelectEntity } from "@/hooks/documents/use-select-entity";

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

function useDocumentContextMenu() {
  const queryClient = useQueryClient();
  const openDocument = useSelectEntity();
  const { execute } = useAction(createDocument, {
    onSuccess: (data) => {
      toast.success(data.isFolder ? "Папка создана" : "Файл создан", {
        action: {
          label: "Открыть",
          onClick: () =>
            openDocument(data.id, data.isFolder ? "folder" : "file"),
        },
      });

      if (data.parentId) {
        queryClient.invalidateQueries({ queryKey: ["folder", data.parentId] });
        queryClient.invalidateQueries({
          queryKey: ["folder-breadcrumbs", data.parentId],
        });
      }
    },
  });

  const searchParams = useSearchParams();
  const currentFolder = searchParams.get("folder");

  const onCreateFile = () =>
    execute({
      title: "Untitled",
      isFolder: false,
      parentId: currentFolder ?? undefined,
    });

  const onCreateFolder = () =>
    execute({
      title: "Untitled",
      isFolder: true,
      parentId: currentFolder ?? undefined,
    });

  const menuItems: DocumentContextMenuItem[] = [
    {
      onClick: onCreateFile,
      label: "Создать документ",
      icon: FileIcon,
    },
    {
      onClick: onCreateFolder,
      label: "Создать папку",
      icon: FolderIcon,
    },
  ];

  return menuItems;
}
