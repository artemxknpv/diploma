import { z } from "zod";

export const CreateCardSchema = z.object({
  title: z
    .string({
      required_error: "Card title is required",
      invalid_type_error: "Card title is required",
    })
    .min(1, "Title cannot be empty"),
  boardId: z.string(),
  listId: z.string(),
});
