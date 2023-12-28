import { z } from "zod";

export const CreateDocumentSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, {
      message: "Title must be at least 3 symbols short",
    }),
  parentId: z.string().optional(),
  content: z.string().optional(),
  isFolder: z.boolean().optional(),
  public: z.boolean().optional(),
});
