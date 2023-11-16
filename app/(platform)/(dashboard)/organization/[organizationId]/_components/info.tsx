"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";
import { CreditCardIcon } from "lucide-react";
import Image from "next/image";

export function Info() {
  const { organization, isLoaded } = useOrganization();

  if (!isLoaded || !organization) {
    return <Info.Skeleton />;
  }

  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Image
          fill
          src={organization.imageUrl}
          alt="organization"
          className="rounded-md object-cover"
        />
      </div>
      <div className="space-y-1">
        <p className="text-semibold text-xl">{organization?.name}</p>
        <div className="flex items-center text-muted-foreground text-xs space-x-1">
          <CreditCardIcon className="h-3 w-3" />
          <span>Free</span>
        </div>
      </div>
    </div>
  );
}

Info.Skeleton = function InfoSkeleton() {
  return (
    <div className="flex items-center gap-x-4">
      <div className="w-[60px] h-[60px] relative">
        <Skeleton className="w-full h-full absolute" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <div className="flex items-center gap-x-2">
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </div>
  );
};
