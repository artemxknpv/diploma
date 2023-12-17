import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { useCurrentFolder } from "@/hooks/documents/use-current-folder";

export function useSelectEntity() {
  const router = useRouter();
  const pathname = usePathname();
  const selectedFolder = useCurrentFolder();

  return useCallback(
    (id: string | null, entity?: "folder" | "file") => {
      if (!id || !entity || (entity === "folder" && selectedFolder === id)) {
        return router.push(pathname);
      }

      const current = new URLSearchParams();

      current.set(entity, id);
      const search = current.toString();

      const query = search ? `?${search}` : "";
      router.push(`${pathname}${query}`);
    },
    [pathname, router, selectedFolder],
  );
}
