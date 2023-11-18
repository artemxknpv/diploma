import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { List } from "@prisma/client";
import { UpdateListOrderSchema } from "@/actions/list/update-order/schema";

export type InputType = z.infer<typeof UpdateListOrderSchema>;
export type ReturnType = ActionState<InputType, List[]>;
