import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { List } from "@prisma/client";
import { DeleteListSchema } from "@/actions/list/delete/schema";

export type InputType = z.infer<typeof DeleteListSchema>;
export type ReturnType = ActionState<InputType, List>;
