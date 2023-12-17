import { ActionState } from "@/lib/create-safe-action";
import { Document } from "@prisma/client";
import { z } from "zod";
import { CreateDocumentSchema } from "@/actions/document/create/schema";

export type InputType = z.infer<typeof CreateDocumentSchema>;
export type ReturnType = ActionState<InputType, Document>;
