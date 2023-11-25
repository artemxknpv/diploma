import { ElementRef, PropsWithChildren, useRef } from "react";
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useOrganization } from "@clerk/nextjs";
import { generateUserFullName } from "@/lib/card/generate-user-fullname";
import { User } from "@clerk/backend";
import { useAction } from "@/hooks/use-action";
import { updateCard } from "@/actions/card/update";
import { toast } from "sonner";
import { CheckIcon, XIcon } from "lucide-react";
import { Card } from "@prisma/client";
import { useParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

type CardSelectUserProps = PropsWithChildren<{
  card: Card;
}>;

export function CardSelectOwner({ children, card }: CardSelectUserProps) {
  const { memberships } = useOrganization({
    memberships: { infinite: true },
  });

  const { boardId } = useParams<{ boardId: string }>();
  const users = memberships?.data;
  const closeRef = useRef<ElementRef<"button">>(null);

  const queryClient = useQueryClient();

  const { execute, loading } = useAction(updateCard, {
    onSuccess: (data) => {
      toast.success(
        `Карточка ${data.title} была назначена на ${data.ownerName}`,
      );
      closeRef.current?.click();
      queryClient.invalidateQueries({ queryKey: ["card", card.id] });
      queryClient.invalidateQueries({ queryKey: ["card-log", card.id] });
    },
  });

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="p-0" side="bottom" align="start">
        <Command>
          <CommandInput disabled={loading} placeholder="Set owner" />
          <CommandList>
            <CommandEmpty>Пользователи не найдены</CommandEmpty>
            <CommandGroup>
              {users?.map((user) => {
                const userFullName = generateUserFullName(
                  user.publicUserData as unknown as User,
                );

                const currentOwner = user.id === card.ownerId;

                return (
                  <CommandItem
                    aria-selected={currentOwner}
                    disabled={loading}
                    key={user.id}
                    value={userFullName}
                    onSelect={() => {
                      if (!currentOwner) {
                        execute({
                          ownerId: user.id,
                          ownerName: userFullName,
                          ownerImage: user.publicUserData.imageUrl,
                          id: card.id,
                          boardId,
                        });
                      } else {
                        closeRef.current?.click();
                      }
                    }}
                  >
                    {currentOwner && <CheckIcon className="mr-2 w-4 h-4" />}
                    {userFullName}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <CommandSeparator />
            {card.ownerId && (
              <CommandItem
                className="text-rose-500"
                onSelect={() => {
                  execute({
                    ownerId: null,
                    ownerName: null,
                    ownerImage: null,
                    id: card.id,
                    boardId,
                  });
                }}
              >
                <XIcon className="mr-2 h-4 w-4" />
                Удалить владельца
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
      <PopoverClose ref={closeRef} hidden />
    </Popover>
  );
}
