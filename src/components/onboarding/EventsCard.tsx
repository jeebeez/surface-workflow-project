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
import { CollapsibleCard } from "~/components/onboarding/CollapsibleCard";
import { Button } from "../ui/button";

const formatEventName = (type: string) => {
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
  const { data, refetch } = useEvents(workspaceId, !disabled);
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
      completed={events.length > 0}
      title="Test Surface Tag Events"
      description="Test if the Surface Tag is properly installed and emitting events."
      disabled={disabled}
      actionButton={
        <Button onClick={onTestTag} disabled={disabled}>
          Test Tag
        </Button>
      }
    >
      <div className="space-y-4">
        <div className="overflow-hidden rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Visitor</TableHead>
                <TableHead>Metadata</TableHead>
                <TableHead>Created at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {testing && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-muted-foreground text-center text-sm"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}

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
        <div className="flex justify-end">
          <Button onClick={onTestTag} disabled={testing} variant="default">
            {testing ? "Testing…" : "Test Tag"}
          </Button>
        </div>
      </div>
    </CollapsibleCard>
  );
};

export default EventsCard;
