import { Document } from "@prisma/client";
import { format } from "date-fns";

export function DocumentFile({
  title,
  createdAt,
  authorId,
  updatedAt,
}: Document) {
  return (
    <>
      <span>{title}</span>
      <span>{format(createdAt, "HH:mm:ss, dd.MM.yyyy")}</span>
      <span>{format(updatedAt, "HH:mm:ss, dd.MM.yyyy")}</span>
      <span>{authorId}</span>
    </>
  );
}
