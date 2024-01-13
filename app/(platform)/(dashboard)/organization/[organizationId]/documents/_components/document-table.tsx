"use client";

import { Document } from "@prisma/client";
import { useSelectEntity } from "@/hooks/documents/use-select-entity";
import { DataTable } from "@/components/data-table/data-table";
import { useColumns } from "./documents-table-columns";
import { DocumentsContextMenu } from "@/app/(platform)/(dashboard)/organization/[organizationId]/documents/_components/documents-context-menu";
import { DocumentsBreadcrumbs } from "@/app/(platform)/(dashboard)/organization/[organizationId]/documents/_components/documents-breadcrumbs";
import { Button } from "@/components/ui/button";
import { useSelectedDocuments } from "@/hooks/documents/use-selected-rows";
import { useExchangeBuffer } from "@/hooks/documents/use-copy-paste";
import { useAction } from "@/hooks/use-action";
import { deleteDocument } from "@/actions/document/delete";
import { toast } from "sonner";
import { copyDocument } from "@/actions/document/copy";
import { useCurrentFolder } from "@/hooks/documents/use-current-folder";

type DocumentTableProps = {
  documents: Document[];
};

export function DocumentTable({ documents }: DocumentTableProps) {
  const onClick = useSelectEntity();
  const columns = useColumns();
  const [rowSelection, setRowSelection] = useSelectedDocuments((s) => [
    s.rows,
    s.setRows,
  ]);

  const selectedRowsIds = Object.keys(rowSelection);

  const dropSelection = () => setRowSelection({});
  const [copy, copiedItems] = useExchangeBuffer((s) => [s.set, s.buffer]);

  const { execute: executePaste } = useAction(copyDocument, {
    onSuccess: () => {
      toast.success("Документ вставлен");
      dropSelection();
    },
  });

  const { id: parentId } = useCurrentFolder();

  const pasteDoc = () => {
    executePaste({ ids: copiedItems, parentId: parentId ?? undefined });
  };

  const { execute: deleteDoc } = useAction(deleteDocument, {
    onSuccess: () => {
      toast.success("Документ удален");
      dropSelection();
    },
  });

  const buttonsIfSelected = [
    <Button
      key="copy"
      variant="secondary"
      size="sm"
      onClick={() => copy(selectedRowsIds)}
    >
      Копировать
    </Button>,
    <Button
      size="sm"
      key="del"
      onClick={() => deleteDoc({ ids: selectedRowsIds })}
      variant="destructive"
    >
      Удалить
    </Button>,
  ];

  const buttonsIfCopied = [
    <Button variant="secondary" key="paste" size="sm" onClick={pasteDoc}>
      Вставить скопированные документы
    </Button>,
    <Button
      variant="secondary"
      key="drop-copy"
      size="sm"
      onClick={() => copy([])}
    >
      Сбросить копирование
    </Button>,
  ];

  return (
    <>
      <div className="w-full flex gap-x-2 items-center justify-between">
        <DocumentsBreadcrumbs />
        <div className="flex gap-x-2">
          {selectedRowsIds.length ? buttonsIfSelected : null}
          {copiedItems.length ? buttonsIfCopied : null}
        </div>
      </div>
      <div className="flex flex-col gap-y-2 grow w-full overflow-hidden">
        <DocumentsContextMenu>
          <DataTable
            columns={columns}
            data={documents}
            onRowClick={(doc) => {
              onClick(doc.id, doc.isFolder ? "folder" : "file");
              setRowSelection({});
            }}
            rowSelection={rowSelection}
            setRowSelection={setRowSelection}
          />
        </DocumentsContextMenu>
      </div>
    </>
  );
}
