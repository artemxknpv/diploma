import { useDocumentNameModal } from "@/hooks/documents/use-document-name-modal";
import { useAction } from "@/hooks/use-action";
import { editDocument } from "@/actions/document/edit";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { TextField } from "@/components/form/text-field";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { createDocument } from "@/actions/document/create";
import { useCurrentFolder } from "@/hooks/documents/use-current-folder";
import { useSelectEntity } from "@/hooks/documents/use-select-entity";

export function DocumentNameModal() {
  const {
    id,
    open,
    onClose,
    title = "Без названия",
    isFolder,
  } = useDocumentNameModal();

  const { id: currentFolder, refresh } = useCurrentFolder();

  const { execute: editDoc, fieldErrors: editionErrors } = useAction(
    editDocument,
    {
      onSuccess: () => {
        refresh();
        onClose();
      },
    },
  );
  const renameDoc = (id: string, newName: string) => {
    editDoc({ documents: [{ id, title: newName }] });
  };

  const openDocument = useSelectEntity();

  const { execute: createDoc, fieldErrors: creationErrors } = useAction(
    createDocument,
    {
      onSuccess: (data) => {
        toast.success(data.isFolder ? "Папка создана" : "Файл создан", {
          action: {
            label: "Открыть",
            onClick: () =>
              openDocument(data.id, data.isFolder ? "folder" : "file"),
          },
        });

        refresh();
        onClose();
      },
    },
  );

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    if (id) {
      renameDoc(id, title);
    } else {
      createDoc({
        isFolder,
        title,
        ...(currentFolder ? { parentId: currentFolder } : {}),
      });
    }
  };

  const errors = {
    title: creationErrors?.title || editionErrors?.documents,
  };

  return (
    <Dialog onOpenChange={onClose} open={open}>
      <DialogContent className="w-1/3 max-w-[400px]">
        <DialogHeader>Имя документа/папки</DialogHeader>
        <form action={onSubmit}>
          <div className="flex flex-col gap-y-3">
            <TextField
              defaultValue={title}
              errors={errors}
              id="title"
              label="Введите имя документа/папки"
              type="text"
            />
            <Button type="submit">Сохранить</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
