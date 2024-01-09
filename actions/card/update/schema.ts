import { z } from "zod";

export const UpdateCardSchema = z.object({
  title: z.optional(
    z
      .string({
        required_error: "Имя не может быть пустым",
        invalid_type_error: "Имя не может быть пустым",
      })
      .min(1, "Имя не может быть пустым"),
  ),
  description: z.optional(
    z.string().min(3, { message: "Description is too short" }),
  ),
  ownerId: z.optional(z.string()).nullable(),
  ownerName: z.optional(z.string()).nullable(),
  ownerImage: z.optional(z.string()).nullable(),
  id: z.string(),
  boardId: z.string(),
});
