import { z } from "zod";

export const DeleteDocumentSchema = z.object({
  ids: z.string().array(),
});
