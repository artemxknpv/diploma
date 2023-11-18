import { z } from "zod";

export const UpdateListSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(3, "Title must have length of 3 symbols or more"),
  id: z.string(),
  boardId: z.string(),
});
