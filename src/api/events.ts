import { useQuery } from "@tanstack/react-query";
import axiosInstance from "./axiosInstance";
import { PAGE_SIZE } from "~/lib/const";

interface EventData {
  id: string;
  type: string;
  visitorId: string;
  payload: unknown;
  createdAt: string;
}

interface EventsResponse {
  events: EventData[];
  pagination?: {
    hasMore: boolean;
    nextOffset: number | null;
    limit: number;
    offset: number;
  };
}

export const useEvents = (
  workspaceId: string | undefined,
  enabled?: boolean,
) => {
  return useQuery<EventsResponse>({
    queryKey: ["events", workspaceId],
    queryFn: async () => {
      const { data } = await axiosInstance.get<EventsResponse>(
        `/api/dashboard/events?workspaceId=${encodeURIComponent(workspaceId!)}&limit=${PAGE_SIZE}&offset=0`,
      );
      return data;
    },
    enabled,
    // refetchInterval: 2000,
  });
};
