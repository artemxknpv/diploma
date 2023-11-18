import { z } from "zod";

export const CreateListSchema = z.object({
  title: z
    .string({
      required_error: "List title is required",
      invalid_type_error: "List title is required",
    })
    .min(1, "Title cannot be empty"),
  boardId: z.string(),
});
