import { ColumnDef } from "@tanstack/react-table";
import { Document } from "@prisma/client";
import { FileIcon, FolderIcon, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { deleteDocument } from "@/actions/document/delete";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useExchangeBuffer } from "@/hooks/documents/use-copy-paste";
import { copyDocument } from "@/actions/document/copy";
import { useSelectedDocuments } from "@/hooks/documents/use-selected-rows";
import { useCurrentFolder } from "@/hooks/documents/use-current-folder";
import { useState } from "react";
import { useDocumentNameModal } from "@/hooks/documents/use-document-name-modal";

export function useColumns() {
  const queryClient = useQueryClient();
  const [copy, buffer] = useExchangeBuffer((s) => [s.set, s.buffer]);
  const setRowSelection = useSelectedDocuments((s) => s.setRows);
  const dropSelection = () => setRowSelection({});
  const currentFolder = useCurrentFolder();
  const [noFolderCopyToast, setNoFolderCopyToast] = useState(false);

  const openRenameModal = useDocumentNameModal((s) => s.onOpen);

  const folderCopyNotSupportedNotification = () => {
    toast.warning(
      "Копирование папок временно не поддерживается. Если они выбраны, скопированы они не будут",
      {
        action: {
          label: "Понятно",
          onClick: () => setNoFolderCopyToast(true),
        },
      },
    );
  };

  const refreshCurrentFolder = () => {
    queryClient.invalidateQueries({
      queryKey: ["folder", currentFolder],
    });
    queryClient.invalidateQueries({
      queryKey: ["folder-breadcrumbs", currentFolder],
    });
  };

  const { execute: deleteDoc } = useAction(deleteDocument, {
    onSuccess: () => {
      toast.success("Документ удален");
      dropSelection();
      refreshCurrentFolder();
    },
  });

  const { execute: pasteDoc } = useAction(copyDocument, {
    onSuccess: () => {
      toast.success("Документ вставлен");
      dropSelection();
      refreshCurrentFolder();
    },
  });

  const actions = (doc: Document) => [
    {
      label: "Копировать",
      onClick: () => {
        copy(doc.id);
        toast("Документ скопирован");
      },
      hidden: doc.isFolder,
    },
    {
      label: "Переименовать",
      onClick: () => openRenameModal({ id: doc.id }),
    },
    {
      label: "Вставить",
      onClick: () => pasteDoc({ ids: buffer, parentId: doc.id }),
      hidden: !doc.isFolder || !buffer.length,
    },
    {
      label: "Удалить",
      className: "text-red-400 font-medium",
      onClick: () => deleteDoc({ ids: [doc.id] }),
    },
  ];

  const columns: ColumnDef<Document>[] = [
    {
      id: "select",
      meta: { selfClickable: true },
      header: ({ table }) => (
        <div className="flex items-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(v) => {
              if (v && !noFolderCopyToast) {
                folderCopyNotSupportedNotification();
              }
              return table.toggleAllPageRowsSelected(!!v);
            }}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(v) => {
              if (row.original.isFolder && v && !noFolderCopyToast) {
                folderCopyNotSupportedNotification();
              }
              return row.getToggleSelectedHandler()(v);
            }}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: "Имя",
      cell: ({ row: { original: doc }, column }) => {
        const Icon = doc.isFolder ? FolderIcon : FileIcon;

        return (
          <div
            className="flex gap-x-2 items-center"
            role="button"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            <Icon className="w-4 h-4" />
            {doc.title}
          </div>
        );
      },
    },
    {
      accessorKey: "authorId",
      header: "Создатель",
    },
    {
      accessorKey: "createdAt",
      header: "Дата создания",
      cell: ({ row: { original: doc } }) =>
        format(new Date(doc.createdAt), "HH:mm:ss, dd.MM.yyyy"),
    },
    {
      accessorKey: "updatedAt",
      header: "Обновлено",
      cell: ({ row: { original: doc } }) =>
        format(new Date(doc.updatedAt), "HH:mm:ss, dd.MM.yyyy"),
    },
    {
      id: "actions",
      meta: { selfClickable: true },
      cell: ({ row }) => {
        const doc = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Действия</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {actions(doc).map((a) =>
                a.hidden ? null : (
                  <DropdownMenuItem
                    onClick={a.onClick}
                    className={a.className}
                    key={a.label}
                  >
                    {a.label}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return columns;
}
