import { ColumnDef } from "@tanstack/react-table";
import { Document } from "@prisma/client";
import { FileIcon, FolderIcon, GlobeIcon, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useDocumentTableColumnsActions } from "@/app/(platform)/(dashboard)/organization/[organizationId]/documents/_components/document-table-columns-actions";
import { useDocumentContextMenu } from "@/app/(platform)/(dashboard)/organization/[organizationId]/documents/_components/documents-context-menu";

export function useColumns() {
  const [noFolderCopyToast, setNoFolderCopyToast] = useState(false);
  const getActions = useDocumentTableColumnsActions();

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

  const contextMenuItems = useDocumentContextMenu();

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
        const Icon = doc.isFolder
          ? FolderIcon
          : doc.public
            ? GlobeIcon
            : FileIcon;

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
      header: () => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" className="h-7" variant="primary">
              Создать...
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {contextMenuItems.map(({ icon: Icon, ...i }) => (
              <DropdownMenuItem asChild onClick={i.onClick} key={i.label}>
                <div className="flex gap-x-2 items-center">
                  {Icon && <Icon className="w-4 h-4" />}
                  {i.label}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
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
              {getActions(doc).map((a) =>
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
