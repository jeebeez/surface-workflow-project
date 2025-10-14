"use client";

import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { copyToClipboard } from "~/lib/clipboard";
import { AlertWrapper } from "~/components/ui/alert-wrapper";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { CollapsibleCard } from "~/components/ui/CollapsibleCard";

enum TestStatus {
  PASSED = "PASSED",
  CHECKING = "CHECKING",
  ERROR = "ERROR",
}

export default function InstallCard({
  workspaceId,
  onTest,
}: {
  workspaceId: string;
  tagUrl: string;
  onTest: (status: boolean) => void;
}) {
  const [testStatus, setTestStatus] = useState<TestStatus>();

  const snippet = useMemo(() => {
    return `<script>
  (function(w, d, s, l, t) {
    w[l] = w[l] || [];
    w[l].push({
      'surface.start': new Date().getTime(),
      event: 'surface.js'
    });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s),
      dl = l != 'surface' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.surface-analytics.com/tag.js?id=' + t + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'surface', 'SURFACE_TAG_ID');
</script>`;
  }, []);

  async function verify() {
    try {
      setTestStatus(TestStatus.CHECKING);
      const res = await fetch(
        `/api/dashboard/events?workspaceId=${encodeURIComponent(workspaceId)}&limit=10`,
        { cache: "no-store" },
      );
      const json = (await res.json()) as { events?: unknown[] };
      const eventCount = (json?.events ?? []).length;

      if (eventCount > 0) {
        setTestStatus(TestStatus.PASSED);
        onTest(true);
      } else {
        setTestStatus(TestStatus.ERROR);
        onTest(false);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setTestStatus(TestStatus.ERROR);
    }
  }

  return (
    <CollapsibleCard
      title="Install the Surface Tag"
      description="Enable tracking and analytics."
      actionButton={<Button>Test connection</Button>}
    >
      <div className="relative w-full rounded-lg border bg-zinc-50 p-4">
        <Button
          className="absolute top-4 right-4"
          variant="default"
          onClick={() => copyToClipboard(snippet)}
          size="sm"
        >
          Copy Snippet
        </Button>

        <pre className="pr-20 font-mono text-xs leading-relaxed">
          {snippet.split("\n").map((line, i) => (
            <div key={i} className="flex">
              <span className="mr-4 inline-block w-8 text-right text-gray-400 select-none">
                {i + 1}.
              </span>
              <span className="flex-1">{line}</span>
            </div>
          ))}
        </pre>
      </div>

      {/* Status Alerts */}
      {testStatus === TestStatus.CHECKING && (
        <AlertWrapper
          variant="default"
          icon={<CheckCircleIcon />}
          title="Checking for Tag..."
          description="Verifying connection to Surface Analytics..."
        />
      )}

      {testStatus === TestStatus.PASSED && (
        <AlertWrapper
          variant="success"
          icon={<CheckCircleIcon />}
          title="Connected successfully!"
          description="Surface Tag is properly installed and tracking events."
        />
      )}

      {testStatus === TestStatus.ERROR && (
        <AlertWrapper
          variant="destructive"
          title="Connection failed"
          description="No events detected. Please ensure the tag is properly installed on your site."
        />
      )}

      <div className="flex justify-end">
        <Button
          onClick={verify}
          disabled={testStatus === TestStatus.CHECKING}
          variant="default"
        >
          {testStatus === TestStatus.CHECKING ? "Testing…" : "Test connection"}
        </Button>
      </div>
    </CollapsibleCard>
  );
}
