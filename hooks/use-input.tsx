import { ElementRef, RefObject, useRef, useState } from "react";

export function useInput(
  initialValue: string,
  props?: {
    formRef?: RefObject<HTMLFormElement>;
  },
) {
  const { formRef } = props ?? {};

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(initialValue);

  const ownFormRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const targetFormRef = formRef ?? ownFormRef;

  const enableEditing = () => {
    setEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const onBlur = () => {
    targetFormRef?.current?.requestSubmit();
  };

  const disableEditing = () => setEditing(false);

  const disableOnEsc = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  return {
    editing,
    enableEditing,
    disableEditing,
    formRef: targetFormRef,
    inputRef,
    onBlur,
    inputValue,
    setInputValue,
    disableOnEsc,
  };
}
