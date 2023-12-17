import { z } from "zod";
import { ActionState } from "@/lib/create-safe-action";
import { Document } from "@prisma/client";
import { CopyDocumentSchema } from "@/actions/document/copy/schema";

export type InputType = z.infer<typeof CopyDocumentSchema>;
export type ReturnType = ActionState<InputType, Document[]>;
