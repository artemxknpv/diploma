import { Divide, XCircleIcon } from "lucide-react";

type FormErrorProps = {
  inputId: string;
  errors?: Record<string, string[] | undefined>;
};

export function FormErrors({ inputId, errors }: FormErrorProps) {
  if (!errors) {
    return null;
  }

  return (
    <div
      aria-live="polite"
      className="mt-2 text-xs text-rose-500"
      id={inputId + "-error"}
    >
      {errors?.[inputId]?.map((e) => (
        <div
          key={e}
          className="flex items-center font-medium p-2 border border-rose-500 bg-rose-500/10 rounded-sm gap-x-2"
        >
          <XCircleIcon className="h-4 w-4" />
          {e}
        </div>
      ))}
    </div>
  );
}
