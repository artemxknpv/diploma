import { Info } from "../_components/info";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { ActivityList } from "./_components/activity-list";

export default function ActivityPage() {
  return (
    <div className="w-full">
      <Info />
      <Separator className="my-4" />
      <div className="px-2 md:px-4">
        <Suspense fallback={<ActivityList.Skeleton />}>
          <ActivityList />
        </Suspense>
      </div>
    </div>
  );
}
