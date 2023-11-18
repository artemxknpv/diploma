import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { DeleteCardSchema } from "@/actions/card/delete/schema";

export type InputType = z.infer<typeof DeleteCardSchema>;
export type ReturnType = ActionState<InputType, Card>;
