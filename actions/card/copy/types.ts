import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { Card } from "@prisma/client";
import { CopyCardSchema } from "@/actions/card/copy/schema";

export type InputType = z.infer<typeof CopyCardSchema>;
export type ReturnType = ActionState<InputType, Card>;
