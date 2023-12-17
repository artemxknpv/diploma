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
import { useCurrentFolder } from "@/hooks/documents/use-current-folder";
import { useQueryClient } from "@tanstack/react-query";

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
  const copy = useExchangeBuffer((s) => s.set);
  const currentFolder = useCurrentFolder();
  const queryClient = useQueryClient();

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

  return (
    <>
      <div className="w-full flex gap-x-2 items-center justify-between">
        <DocumentsBreadcrumbs />
        {selectedRowsIds.length ? (
          <div className="flex gap-x-2">
            <Button size="sm" onClick={() => copy(selectedRowsIds)}>
              Копировать
            </Button>
            <Button
              size="sm"
              onClick={() => deleteDoc({ ids: selectedRowsIds })}
              variant="destructive"
            >
              Удалить
            </Button>
          </div>
        ) : null}
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
