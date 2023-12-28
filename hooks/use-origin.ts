import { useMounted } from "@/hooks/use-mounted";

export function useOrigin() {
  const mounted = useMounted();
  if (!mounted) return "";

  return typeof window === "undefined" ? "" : window.location.origin;
}
