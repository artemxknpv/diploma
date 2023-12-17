import { ChevronRightIcon, HomeIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Document } from "@prisma/client";
import { fetcher } from "@/lib/fetcher";
import { useSelectEntity } from "@/hooks/documents/use-select-entity";
import { useSearchParams } from "next/navigation";
import { Fragment } from "react";
import { cn } from "@/lib";

export function DocumentsBreadcrumbs() {
  const searchParams = useSearchParams();
  const selectBreadcrumb = useSelectEntity();
  const selectedFolderId = searchParams.get("folder");

  const { data: breadcrumbs } = useQuery<Array<Pick<Document, "id" | "title">>>(
    {
      queryKey: ["folder-breadcrumbs", selectedFolderId],
      queryFn: () => fetcher(`/api/folders/${selectedFolderId}/breadcrumbs`),
    },
  );

  if (!breadcrumbs?.length) return null;

  return (
    <div className="flex gap-x-1 items-center h-9 text-sm">
      <div role="button" onClick={() => selectBreadcrumb(null)}>
        <HomeIcon className="w-4 h-4" />
      </div>
      <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
      {breadcrumbs.map((el, index) => {
        const lastElement = index + 1 === breadcrumbs.length;

        return (
          <Fragment key={el.id}>
            <div
              role={lastElement ? undefined : "button"}
              title={el.id}
              className={cn({
                "text-muted-foreground cursor-default": lastElement,
              })}
              onClick={
                lastElement
                  ? undefined
                  : () => selectBreadcrumb(el.id, "folder")
              }
            >
              {el.title}
            </div>
            {!lastElement ? (
              <ChevronRightIcon className="w-4 h-4 text-muted-foreground" />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
