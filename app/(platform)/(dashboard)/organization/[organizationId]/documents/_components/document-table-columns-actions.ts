import { useAction } from "@/hooks/use-action";
import { deleteDocument } from "@/actions/document/delete";
import { toast } from "sonner";
import { copyDocument } from "@/actions/document/copy";
import { Document } from "@prisma/client";
import { useExchangeBuffer } from "@/hooks/documents/use-copy-paste";
import { useSelectedDocuments } from "@/hooks/documents/use-selected-rows";
import { useDocumentNameModal } from "@/hooks/documents/use-document-name-modal";
import { editDocument } from "@/actions/document/edit";
import { useOrigin } from "@/hooks/use-origin";

export function useDocumentTableColumnsActions() {
  const [copy, buffer] = useExchangeBuffer((s) => [s.set, s.buffer]);
  const setRowSelection = useSelectedDocuments((s) => s.setRows);
  const dropSelection = () => setRowSelection({});
  const openRenameModal = useDocumentNameModal((s) => s.onOpen);

  const { execute: deleteDoc } = useAction(deleteDocument, {
    onSuccess: () => {
      toast.success("Документ удален");
      dropSelection();
    },
  });

  const { execute: pasteDoc } = useAction(copyDocument, {
    onSuccess: () => {
      toast.success("Документ вставлен");
      dropSelection();
    },
  });

  const { execute: editDoc } = useAction(editDocument, {
    onSuccess: (data) => {
      toast.success(`Документ ${data[0].public ? "опубликован" : "скрыт"}`);
    },
  });

  const togglePublish = (id: string, published: boolean) => {
    editDoc({ documents: [{ id, public: !published }] });
  };

  const origin = useOrigin();

  return (doc: Document) => [
    {
      label: "Копировать",
      onClick: () => {
        copy(doc.id);
        toast("Документ скопирован");
      },
      hidden: doc.isFolder,
    },
    {
      label: "Опубликовать",
      onClick: () => {
        togglePublish(doc.id, doc.public);
      },
      hidden: doc.isFolder || doc.public,
    },
    {
      label: "Отменить публикацию",
      onClick: () => {
        togglePublish(doc.id, doc.public);
      },
      hidden: doc.isFolder || !doc.public,
    },
    {
      label: "Скопировать публичную ссылку",
      onClick: () => {
        copyText(`${origin}/published/${doc.id}`);
      },
      hidden: doc.isFolder || !doc.public,
    },
    {
      label: "Переименовать",
      onClick: () =>
        openRenameModal({
          id: doc.id,
          title: doc.title,
          isFolder: doc.isFolder,
        }),
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
}

const copyText = (text: string) => navigator.clipboard.writeText(text);
