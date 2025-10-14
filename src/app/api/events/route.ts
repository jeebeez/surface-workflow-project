import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { db as prisma } from "~/server/db";
import { z } from "zod";
import { EventType, type Prisma } from "@prisma/client";
import { corsHeaders } from "~/lib/cors";
import { createJsonResponse } from "~/lib/createJsonResponse";

export const runtime = "nodejs";

const MAX_PAYLOAD_BYTES = 512 * 1024; // 512KB
const MAX_EVENTS_PER_REQUEST = 20;

const EventItemSchema = z.object({
  type: z.enum([
    EventType.CLICK,
    EventType.PAGE,
    EventType.TRACK,
    EventType.IDENTITY,
  ]),
  visitorId: z.string(),
  eventId: z.string().uuid(),
  elementId: z.string().optional(),
  pageUrl: z.string(),
  occurredAt: z.string().datetime().optional(),
  refferUrl: z.string().url().optional(),
  userId: z.string().optional(),
});

const IncomingBatchSchema = z.object({
  workspaceId: z.string(),
  events: z.array(EventItemSchema).min(1).max(MAX_EVENTS_PER_REQUEST),
});

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const headers = corsHeaders();

  try {
    const raw = await req.text();
    const payloadBytes = Buffer.byteLength(raw, "utf8");
    if (payloadBytes > MAX_PAYLOAD_BYTES) {
      return createJsonResponse({ error: "Payload too large" }, 413, headers);
    }

    let body: z.infer<typeof IncomingBatchSchema>;
    try {
      const parsed: unknown = JSON.parse(raw);
      body = IncomingBatchSchema.parse(parsed);
    } catch {
      return createJsonResponse(
        { error: "Invalid JSON payload" },
        400,
        headers,
      );
    }

    const recordsToCreate: Array<Prisma.EventCreateManyInput> = [];

    for (const ev of body.events) {
      const type = ev.type.toUpperCase() as EventType;
      if (!Object.values(EventType).includes(type)) {
        return createJsonResponse(
          { error: `Invalid event type: ${ev.type}` },
          422,
          headers,
        );
      }

      let url: URL;
      try {
        url = new URL(ev.pageUrl);
      } catch {
        return createJsonResponse(
          { error: `Invalid pageUrl: ${ev.pageUrl}` },
          422,
          headers,
        );
      }
      const metadata: Record<string, string> = {};
      if (ev.userId && type === EventType.IDENTITY) metadata.userId = ev.userId;
      if (type === EventType.CLICK && ev.elementId)
        metadata.elementId = ev.elementId;
      if (type === EventType.PAGE) metadata.pageUrl = ev.pageUrl;

      const createItem = {
        workspaceId: body.workspaceId,
        type,
        visitorId: ev.visitorId,
        elementId: ev.elementId ?? null,
        eventId: ev.eventId,
        host: url.hostname,
        path: url.pathname || null,
        refferUrl: ev.refferUrl ?? null,
        occurredAt: ev.occurredAt ? new Date(ev.occurredAt) : null,
        metadata,
      };
      recordsToCreate.push(createItem);
    }

    if (recordsToCreate.length > 0) {
      await prisma.event.createMany({
        data: recordsToCreate,
        skipDuplicates: true,
      });
    }

    return createJsonResponse(
      {
        ok: true,
      },
      200,
      headers,
    );
  } catch (error) {
    console.error("Error processing event:", error);
    return createJsonResponse({ error: "Internal server error" }, 500, headers);
  }
}
