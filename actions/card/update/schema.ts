import { z } from "zod";

export const UpdateCardSchema = z.object({
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
      })
      .min(1, "Title cannot be empty"),
  ),
  description: z.optional(
    z.string().min(3, { message: "Description is too short" }),
  ),
  id: z.string(),
  boardId: z.string(),
});
