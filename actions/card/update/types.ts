import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { UpdateCardSchema } from "./schema";

export type InputType = z.infer<typeof UpdateCardSchema>;
export type ReturnType = ActionState<InputType, Card>;
