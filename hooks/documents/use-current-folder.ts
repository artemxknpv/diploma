import { useSearchParams } from "next/navigation";

export function useCurrentFolder() {
  const searchParams = useSearchParams();
  return searchParams.get("folder");
}
