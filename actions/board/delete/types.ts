import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { Board } from "@prisma/client";
import { DeleteBoardSchema } from "@/actions/board/delete/schema";

export type InputType = z.infer<typeof DeleteBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;
