"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type State = {
  errors?: {
    title?: string[];
  };
  message?: string | null;
};

const CreateBoard = z.object({
  title: z.string().min(3, {
    message: "Title cannot be shorter than 3 symbols",
  }),
});

export async function create(prevState: State, formData: FormData) {
  const validatedFields = CreateBoard.safeParse({
    title: formData.get("title"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Fields missing",
    };
  }

  const { title } = validatedFields.data;

  if (title) {
    try {
      await db.board.create({
        data: { title },
      });
    } catch (e) {
      return { message: "Database error" };
    }
  }

  revalidatePath("/organization/org_2YBAj73Dy5GpNF5wY9i4dcoMpR5");
  redirect("/organization/org_2YBAj73Dy5GpNF5wY9i4dcoMpR5");
}
