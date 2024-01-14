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
    required_error: "Необходимо выбрать фоновое изображение",
    invalid_type_error: "Необходимо выбрать фоновое изображение",
  }),
});
