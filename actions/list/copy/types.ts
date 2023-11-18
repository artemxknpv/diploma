import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { List } from "@prisma/client";
import { CopyListSchema } from "@/actions/list/copy/schema";

export type InputType = z.infer<typeof CopyListSchema>;
export type ReturnType = ActionState<InputType, List>;
