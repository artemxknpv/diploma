import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useCurrentFolder() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const currentFolder = searchParams.get("folder");

  const refreshCurrentFolder = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["folder", currentFolder],
    });
    queryClient.invalidateQueries({
      queryKey: ["folder-breadcrumbs", currentFolder],
    });
  }, [currentFolder, queryClient]);

  return { id: currentFolder, refresh: refreshCurrentFolder };
}
