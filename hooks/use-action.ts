import { ActionState, FieldErrors } from "@/lib/create-safe-action";
import { useCallback, useState } from "react";

type Action<TInput, TOutput> = (
  data: TInput,
) => Promise<ActionState<TInput, TOutput>>;

type UseActionParams<TOutput> = {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
};

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  { onComplete, onError, onSuccess }: UseActionParams<TOutput> = {},
) => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput>>();
  const [error, setError] = useState<string>();
  const [data, setData] = useState<TOutput>();
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (input: TInput) => {
      setLoading(true);

      try {
        const result = await action(input);

        if (!result) {
          return;
        }

        if (result.fieldErrors) {
          setFieldErrors(result.fieldErrors);
        }

        if (result.error) {
          setError(result.error);
          onError?.(result.error);
        }

        if (result.data) {
          setData(result.data);
          setError(undefined);
          setFieldErrors(undefined)
          onSuccess?.(result.data);
        }
      } finally {
        setLoading(false);
        onComplete?.();
      }
    },
    [action, onComplete, onError, onSuccess],
  );

  return { fieldErrors, data, error, loading, execute };
};
