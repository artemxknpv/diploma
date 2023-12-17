import { ArrowLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Document } from "@prisma/client";

type DocumentContentProps = {
  document: Document;
};

export function DocumentContent({ document }: DocumentContentProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-4">
      <div
        className="flex gap-x-2 items-center cursor-pointer"
        role="button"
        onClick={() => router.back()}
      >
        <ArrowLeftIcon className="w-4 h-4" /> Назад
      </div>
      <div>{document.title}</div>
    </div>
  );
}
