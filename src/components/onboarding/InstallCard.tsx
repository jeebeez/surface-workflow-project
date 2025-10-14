"use client";

import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { copyToClipboard } from "~/lib/clipboard";
import { AlertWrapper } from "~/components/ui/alert-wrapper";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from "@heroicons/react/20/solid";
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
    if (testStatus === TestStatus.PASSED) {
      onTest(true);
      return;
    }
    try {
      setTestStatus(TestStatus.CHECKING);
      const res = await fetch(
        `/api/dashboard/events?workspaceId=${encodeURIComponent(workspaceId)}&limit=10&offset=0`,
        { cache: "no-store" },
      );
      const json = (await res.json()) as { events?: unknown[] };
      const eventCount = (json?.events ?? []).length;

      if (eventCount > 0) {
        setTestStatus(TestStatus.PASSED);
      } else {
        setTestStatus(TestStatus.ERROR);
        onTest(false);
      }
    } catch (error) {
      console.error("Verification failed:", error);
      setTestStatus(TestStatus.ERROR);
    }
  }
  const buttonText = useMemo(() => {
    if (testStatus === TestStatus.CHECKING) return "Testing…";
    if (testStatus === TestStatus.PASSED) return "Next Step";
    return "Test Connection";
  }, [testStatus]);

  return (
    <CollapsibleCard
      completed={testStatus === TestStatus.PASSED}
      title="Install the Surface Tag"
      description="Enable tracking and analytics."
      actionButton={<Button>Install Tag</Button>}
    >
      <div className="space-y-4">
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

        {testStatus === TestStatus.CHECKING && (
          <AlertWrapper
            variant="default"
            icon={<InformationCircleIcon className="text-blue-500!" />}
            title="Checking for Tag..."
          />
        )}

        {testStatus === TestStatus.PASSED && (
          <AlertWrapper
            variant="success"
            icon={<CheckCircleIcon />}
            title="Connected successfully!"
          />
        )}

        {testStatus === TestStatus.ERROR && (
          <AlertWrapper
            icon={<ExclamationCircleIcon width={40} />}
            variant="destructive"
            title="We couldn’t detect the Surface Tag on your website. Please ensure the snippet is added correctly."
            description={
              <ul className="list-inside list-disc text-sm">
                <li>
                  Recheck the code snippet to ensure it’s correctly placed
                  before the closing &lt;/head&gt; tag.
                </li>
                <li>
                  Ensure there are no blockers (like ad blockers) preventing the
                  script from running.
                </li>
                <li>Try again once you’ve made the corrections.</li>
              </ul>
            }
          />
        )}

        <div className="flex justify-end">
          <Button
            onClick={verify}
            disabled={testStatus === TestStatus.CHECKING}
            variant="default"
          >
            {buttonText}
          </Button>
        </div>
      </div>
    </CollapsibleCard>
  );
}
