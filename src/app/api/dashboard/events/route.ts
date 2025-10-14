import type { NextRequest } from "next/server";
import {
  NextResponse,
  type NextResponse as NextResponseType,
} from "next/server";
import { EventType, type Prisma } from "@prisma/client";
import { db as prisma } from "~/server/db";
import { z } from "zod";
import { createJsonResponse } from "~/lib/createJsonResponse";
import { corsHeaders } from "~/lib/cors";
import { PAGE_SIZE } from "~/lib/const";

export const runtime = "nodejs";

const QueryParamsSchema = z.object({
  workspaceId: z.string(),
  limit: z.string().optional().default(PAGE_SIZE.toString()).transform(Number),
  offset: z.string().optional().default("0").transform(Number),
  type: z
    .enum([
      EventType.CLICK,
      EventType.PAGE,
      EventType.TRACK,
      EventType.IDENTITY,
    ])
    .optional(),
  visitorId: z.string().uuid().optional(),
  startTime: z.string().datetime().optional(),
  endTime: z.string().datetime().optional(),
});

export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(),
  });
}

export async function GET(req: NextRequest): Promise<NextResponseType> {
  try {
    const { searchParams } = new URL(req.url);

    const queryParams = Object.fromEntries(searchParams.entries());
    let validatedParams: z.infer<typeof QueryParamsSchema>;

    try {
      validatedParams = QueryParamsSchema.parse(queryParams);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        const errorMessage = validationError.errors
          .map((err) => `${err.path.join(".")}: ${err.message}`)
          .join(", ");
        return createJsonResponse({ error: errorMessage }, 400);
      }
      return createJsonResponse({ error: "Invalid query parameters" }, 400);
    }

    const { workspaceId, limit, offset, type, visitorId, startTime, endTime } =
      validatedParams;

    const where: Prisma.EventWhereInput = {
      workspaceId: workspaceId,
    };

    if (type) {
      where.type = type;
    }

    if (visitorId) {
      where.visitorId = visitorId;
    }

    if (startTime || endTime) {
      const receivedAtFilter: Prisma.DateTimeFilter = {};
      if (startTime) {
        receivedAtFilter.gte = new Date(startTime);
      }
      if (endTime) {
        receivedAtFilter.lte = new Date(endTime);
      }
      where.receivedAt = receivedAtFilter;
    }

    const queryOptions: Prisma.EventFindManyArgs = {
      where,
      orderBy: {
        receivedAt: "desc",
      },
      take: limit + 1, // Fetch one extra to determine if there are more
      skip: offset,
      select: {
        id: true,
        type: true,
        visitorId: true,
        metadata: true,
        receivedAt: true,
      },
    };

    const events = await prisma.event.findMany(queryOptions);

    const hasMore = events.length > limit;
    const returnEvents = hasMore ? events.slice(0, limit) : events;
    const nextOffset = hasMore ? offset + limit : null;

    const transformedEvents = returnEvents.map((event) => ({
      id: event.id,
      type: event.type.toLowerCase(),
      visitorId: event.visitorId,
      payload: event.metadata,
      createdAt: event.receivedAt.toISOString(),
    }));

    return createJsonResponse(
      {
        events: transformedEvents,
        pagination: {
          hasMore,
          nextOffset,
          limit,
          offset,
        },
      },
      200,
    );
  } catch (error) {
    console.error("Error fetching events:", error);
    return createJsonResponse({ error: "Internal server error" }, 500);
  }
}
