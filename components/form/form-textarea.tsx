import { ComponentProps, forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib";
import { FormErrors } from "@/components/form/form-errors";
import { useFormStatus } from "react-dom";

type FormTextareaProps = Pick<
  ComponentProps<typeof Textarea>,
  | "placeholder"
  | "required"
  | "disabled"
  | "className"
  | "onBlur"
  | "onClick"
  | "onKeyDown"
  | "defaultValue"
> & {
  label?: string;
  errors?: Record<string, string[] | undefined>;
  id: string;
};

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  function FormTextarea(
    { label, id, className, errors, disabled, ...textareaProps },
    ref,
  ) {
    const { pending } = useFormStatus();

    return (
      <div className="space-y-2 w-full">
        <div className="space-y-1 w-full">
          {label && (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          )}
          <Textarea
            {...textareaProps}
            className={cn("resize-none shadow-sm", className)}
            ref={ref}
            name={id}
            disabled={disabled || pending}
          />
        </div>
        <FormErrors inputId={id} errors={errors} />
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";
