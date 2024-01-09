import { z } from "zod";

export const UpdateListSchema = z.object({
  title: z
    .string({
      required_error: "Имя не может быть пустым",
      invalid_type_error: "Имя не может быть пустым",
    })
    .min(3, "Имя должно быть не короче 3-х символов"),
  id: z.string(),
  boardId: z.string(),
});
