import { z } from "zod";

export const CreateListSchema = z.object({
  title: z
    .string({
      required_error: "Имя не может быть пустым",
      invalid_type_error: "Имя не может быть пустым",
    })
    .min(1, "Имя не может быть пустым"),
  boardId: z.string(),
});
