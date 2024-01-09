import { z } from "zod";

export const EditDocumentSchema = z.object({
  documents: z.array(
    z.object({
      id: z.string(),
      title: z
        .string({
          required_error: "Имя не может быть пустым",
          invalid_type_error: "Имя не может быть пустым",
        })
        .min(3, {
          message: "Имя должно быть не короче 3-х символов",
        })
        .optional(),
      content: z.string().optional().nullable(),
      public: z.boolean().optional(),
    }),
  ),
});
