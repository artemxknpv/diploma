import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";

type CardHeaderUserProps = {
  imageSrc: string | null;
  userName?: string;
  title: string;
};

export function CardHeaderUser({
  imageSrc,
  userName,
  title,
}: CardHeaderUserProps) {
  return (
    <div className="inline-flex gap-x-2 grow-0 shrink-0 overflow-hidden items-center self-start">
      <Avatar className="w-6 h-6">
        <AvatarImage src={imageSrc ?? ""} asChild>
          <Image src={imageSrc ?? ""} fill alt="no image" />
        </AvatarImage>
        <AvatarFallback>-</AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-sm items-start overflow-hidden">
        <div className="text-muted-foreground text-xs">{title}</div>
        <div className="truncate max-w-4/5 text-xs">{userName}</div>
      </div>
    </div>
  );
}
