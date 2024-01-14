"use client";

import "@blocknote/core/style.css";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { BlockNoteEditor } from "@blocknote/core";
import { useMounted } from "@/hooks/use-mounted";

type DocumentsEditorProps = {
  onChange?: (content: string) => void;
  initialContent?: string;
  editable?: boolean;
};

export default function DocumentsEditor({
  editable,
  initialContent,
  onChange,
}: DocumentsEditorProps) {
  const mounted = useMounted();

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
    onEditorContentChange: (content) =>
      onChange?.(JSON.stringify(content.topLevelBlocks, null, 2)),
  });

  if (!mounted) return null;

  return <BlockNoteView className="w-full" editor={editor} theme="light" />;
}
