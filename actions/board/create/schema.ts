import { z } from "zod";

export const CreateBoardSchema = z.object({
  title: z
    .string({
      required_error: "Имя не может быть пустым",
      invalid_type_error: "Имя не может быть пустым",
    })
    .min(3, {
      message: "Имя должно быть не короче 3-х символов",
    }),

  image: z.string({
    required_error: "Image is required",
    invalid_type_error: "Image is required",
  }),
});
