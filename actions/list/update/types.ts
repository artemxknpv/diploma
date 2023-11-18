import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { List } from "@prisma/client";
import { UpdateListSchema } from "@/actions/list/update/schema";

export type InputType = z.infer<typeof UpdateListSchema>;
export type ReturnType = ActionState<InputType, List>;
