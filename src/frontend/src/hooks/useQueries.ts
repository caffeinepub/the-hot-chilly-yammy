import { useQuery } from "@tanstack/react-query";
import type { Category, Order } from "../backend";
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

export function useGetOrders() {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOrdersByDate(dateString: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Order[]>({
    queryKey: ["orders", dateString],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOrdersByDate(dateString);
    },
    enabled: !!actor && !isFetching && !!dateString,
  });
}

export function useGetTotalByDate(dateString: string) {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["total", dateString],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalByDate(dateString);
    },
    enabled: !!actor && !isFetching && !!dateString,
  });
}

export function useGetDiscount() {
  const { actor, isFetching } = useActor();
  return useQuery<bigint>({
    queryKey: ["discount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getDiscount();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetOnlineStatus() {
  return useQuery<boolean>({
    queryKey: ["onlineStatus"],
    queryFn: async () => {
      const stored = localStorage.getItem("shopOnlineStatus");
      return stored === null ? true : stored === "true";
    },
    staleTime: 0,
  });
}
