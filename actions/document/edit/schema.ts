import { z } from "zod";

export const EditDocumentSchema = z.object({
  documents: z.array(
    z.object({
      id: z.string(),
      title: z
        .string({
          required_error: "Title is required",
          invalid_type_error: "Title is required",
        })
        .min(3, {
          message: "Title must be at least 3 symbols short",
        })
        .optional(),
      content: z.string().optional().nullable(),
    }),
  ),
});
