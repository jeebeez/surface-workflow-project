import { NextResponse } from "next/server";

export const createJsonResponse = (
  payload: unknown,
  status: number,
  additionalHeaders?: Record<string, string>,
): NextResponse => {
  return new NextResponse(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...additionalHeaders,
    },
  });
};
