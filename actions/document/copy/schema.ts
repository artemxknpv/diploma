import { z } from "zod";

export const CopyDocumentSchema = z.object({
  ids: z.string().array(),
  parentId: z.string().optional(),
});
