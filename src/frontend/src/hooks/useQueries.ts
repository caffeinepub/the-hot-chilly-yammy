import { useQuery } from "@tanstack/react-query";
import type { Category } from "../backend";
import { useActor } from "./useActor";

export function useGetMenu() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["menu"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMenu();
    },
    enabled: !!actor && !isFetching,
  });
}
