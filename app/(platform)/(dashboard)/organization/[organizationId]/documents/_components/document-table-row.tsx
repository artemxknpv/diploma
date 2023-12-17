import { FileIcon, FolderIcon } from "lucide-react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { Document } from "@prisma/client";

type DocumentTableRowProps = {
  doc: Document;
  onDelete: () => void;
  onClick: () => void;
};

export function DocumentTableRow({
  doc,
  onDelete,
  onClick,
}: DocumentTableRowProps) {
  const Icon = doc.isFolder ? FolderIcon : FileIcon;

  return (
    <ContextMenu key={doc.id}>
      <ContextMenuTrigger asChild>
        <TableRow onClick={onClick} className="cursor-pointer">
          <TableCell className="flex gap-x-2 items-center">
            <Icon className="w-4 h-4" />
            {doc.title}
          </TableCell>
          <TableCell>{doc.authorId}</TableCell>
          <TableCell>
            {format(new Date(doc.createdAt), "HH:mm:ss, dd.MM.yyyy")}
          </TableCell>
          <TableCell>
            {format(new Date(doc.updatedAt), "HH:mm:ss, dd.MM.yyyy")}
          </TableCell>
        </TableRow>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem>Открыть</ContextMenuItem>
        <ContextMenuItem>Переименовать</ContextMenuItem>
        <ContextMenuItem>Выбрать</ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={onDelete}>Удалить</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
