"use client";

import { ArrowLeftIcon, GlobeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Document } from "@prisma/client";
import { DocumentsEditor } from "@/app/(platform)/(dashboard)/organization/[organizationId]/documents/_components/documents-editor";
import { useAction } from "@/hooks/use-action";
import { editDocument } from "@/actions/document/edit";
import { TextField } from "@/components/form/text-field";
import { useInput } from "@/hooks/use-input";
import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";

type DocumentContentProps = {
  document: Document;
};

export function DocumentContent({ document }: DocumentContentProps) {
  const router = useRouter();
  console.log({ document });
  const { execute: updateDocument } = useAction(editDocument, {});

  const onChange = (content: string) => {
    updateDocument({ documents: [{ id: document.id, content }] });
  };

  const {
    inputValue: title,
    setInputValue,
    inputRef,
    formRef,
    editing,
    enableEditing,
    disableEditing,
    onBlur,
    disableOnEsc,
  } = useInput(document.title);

  const { execute, fieldErrors, loading } = useAction(editDocument, {
    onSuccess: () => {
      toast.success(`Колонка "${title}" обновлена`);
      disableEditing();
      setInputValue(title);
    },
  });

  useEventListener("keydown", disableOnEsc);

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;

    if (title === document.title) return disableEditing();

    execute({ documents: [{ title, id }] });
  };

  return (
    <div className="flex flex-col gap-y-4 w-full items-start">
      <div
        className="inline-flex gap-x-2 items-center cursor-pointer"
        role="button"
        onClick={router.back}
      >
        <ArrowLeftIcon className="w-4 h-4" /> Назад
      </div>
      <div className="px-[54px] flex items-center">
        {editing ? (
          <form action={onSubmit} ref={formRef} className="flex-1 pl-2 py-2">
            <input readOnly hidden id="id" name="id" value={document.id} />
            <TextField
              disabled={loading}
              errors={fieldErrors}
              onBlur={onBlur}
              ref={inputRef}
              id="title"
              className="px-1"
              placeholder="Введите новое название колонки"
              defaultValue={title}
            />
            <button hidden />
          </form>
        ) : (
          <h2
            role="button"
            onClick={enableEditing}
            className="text-zinc-600 text-4xl font-semibold"
          >
            {document.title}
          </h2>
        )}
        {document.public ? (
          <GlobeIcon className="ml-2 w-5 h-5 text-zinc-600" />
        ) : null}
      </div>

      <DocumentsEditor
        onChange={onChange}
        initialContent={document.content ?? undefined}
      />
    </div>
  );
}
