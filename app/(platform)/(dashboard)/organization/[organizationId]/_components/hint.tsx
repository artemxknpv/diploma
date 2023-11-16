import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PropsWithChildren } from "react";

type HintProps = {
  description: string;
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
};

export function Hint({
  children,
  description,
  ...tooltipProps
}: PropsWithChildren<HintProps>) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger>{children}</TooltipTrigger>
        <TooltipContent
          {...tooltipProps}
          className="text-xs max-w-[220px] break-words"
        >
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
