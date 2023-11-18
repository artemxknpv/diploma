import { Card } from "@prisma/client";
import { Button } from "@/components/ui/button";

type CardItemProps = {
  card: Card;
  index: number;
};

export function CardItem({ card, index }: CardItemProps) {
  return (
    <Button
      className="truncate border-2 border-transparent hover:shadow-md py-2 px-3 text-sm rounded-md bg-white hover:bg-white transition shadow-sm w-full"
      textAlign="left"
      variant="secondary"
    >
      {card.title}
    </Button>
  );
}
