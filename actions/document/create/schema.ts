import { z } from "zod";

export const CreateDocumentSchema = z.object({
  title: z
    .string({
      required_error: "Имя не может быть пустым",
      invalid_type_error: "Имя не может быть пустым",
    })
    .min(3, {
      message: "Имя должно быть не короче 3-х символов",
    }),
  parentId: z.string().optional(),
  content: z.string().optional(),
  isFolder: z.boolean().optional(),
  public: z.boolean().optional(),
});
