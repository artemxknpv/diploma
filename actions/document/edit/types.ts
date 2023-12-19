import { ActionState } from "@/lib/create-safe-action";
import { Document } from "@prisma/client";
import { z } from "zod";
import { EditDocumentSchema } from "@/actions/document/edit/schema";

export type InputType = z.infer<typeof EditDocumentSchema>;
export type ReturnType = ActionState<InputType, Document[]>;
