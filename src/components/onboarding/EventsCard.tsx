// components/onboarding/EventsCard.tsx
"use client";

import { useMemo, useState } from "react";
import { useEvents } from "~/api/events";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "~/components/ui/table";
import { Skeleton } from "~/components/ui/skeleton";
import { CollapsibleCard } from "~/components/ui/CollapsibleCard";
import { Button } from "../ui/button";

const formatEventName = (type: string) => {
  // map to labels like in the mock
  const map: Record<string, string> = {
    track: "Track",
    page: "Page",
    identity: "Identity",
    click: "Click",
  };
  return map[type] ?? type;
};

const EventsCard = ({
  workspaceId,
  disabled,
}: {
  workspaceId: string;
  disabled: boolean;
}) => {
  const { data, refetch } = useEvents(workspaceId);

  const [testing, setTesting] = useState(false);

  const events = useMemo(() => {
    return data?.events ?? [];
  }, [data?.events]);

  const onTestTag = async () => {
    setTesting(true);
    await refetch();
    setTesting(false);
  };

  return (
    <CollapsibleCard
      title="Test Surface Tag Events"
      description="Test if the Surface Tag is properly installed and emitting events."
      disabled={testing || disabled}
      actionButton={
        <Button onClick={onTestTag} disabled={testing}>
          Test Tag
        </Button>
      }
    >
      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Visitor</TableHead>
              <TableHead>Metadata</TableHead>
              <TableHead className="text-right">Created at</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testing &&
              Array.from({ length: 4 }).map((_, i) => (
                <TableRow key={`sk-${i}`}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-56" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60%]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-40" />
                  </TableCell>
                </TableRow>
              ))}

            {!testing && events.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-muted-foreground py-6 text-center text-sm"
                >
                  No events yet — open your test page and interact (click a
                  button, type an email), then press <b>Test Tag</b>.
                </TableCell>
              </TableRow>
            )}

            {!testing &&
              events.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="font-medium">
                    {formatEventName(e.type)}
                  </TableCell>
                  <TableCell className="text-muted-foreground font-mono text-xs">
                    {e.visitorId}
                  </TableCell>
                  <TableCell className="max-w-md truncate font-mono text-xs">
                    {JSON.stringify(e.payload)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(e.createdAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
    </CollapsibleCard>
  );
};

export default EventsCard;
