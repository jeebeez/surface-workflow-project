"use client";
import InstallCard from "~/components/onboarding/InstallCard";
import EventsCard from "~/components/onboarding/EventsCard";
import { useState } from "react";
import { Separator } from "~/components/ui/separator";

const WORKSPACE = process.env.NEXT_PUBLIC_WORKSPACE_ID ?? "ws_demo";

export default function GettingStartedPage() {
  const [installed, setInstalled] = useState(false);
  return (
    <main className="mx-auto max-w-4xl space-y-8 py-8">
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">Getting started</h1>
        <Separator />
      </div>
      <InstallCard workspaceId={WORKSPACE} onTest={setInstalled} />
      <EventsCard workspaceId={WORKSPACE} disabled={!installed} />
    </main>
  );
}
