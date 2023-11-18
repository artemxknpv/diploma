import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { Board } from "@prisma/client";
import { UpdateBoardSchema } from "@/actions/board/update/schema";

export type InputType = z.infer<typeof UpdateBoardSchema>;
export type ReturnType = ActionState<InputType, Board>;
