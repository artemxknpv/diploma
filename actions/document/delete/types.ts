import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { Document } from "@prisma/client";
import { DeleteDocumentSchema } from "./schema";

export type InputType = z.infer<typeof DeleteDocumentSchema>;
export type ReturnType = ActionState<InputType, Document[]>;
