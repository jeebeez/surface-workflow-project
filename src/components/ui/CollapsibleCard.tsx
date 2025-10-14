"use client";

import { CheckCircleIcon } from "@heroicons/react/20/solid";
import { useEffect, useState, type ReactNode } from "react";
import { cn } from "~/lib/utils";

interface CollapsibleCardProps {
  title: string;
  description: string;
  actionButton?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  disabled?: boolean;
  completed?: boolean;
}

export function CollapsibleCard({
  title,
  description,
  children,
  className,
  headerClassName,
  actionButton,
  disabled,
  completed,
}: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    if (disabled) return;
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    if (completed) {
      setIsExpanded(true);
    }
  }, [completed]);

  return (
    <div
      className={cn(
        "bg-card text-card-foreground rounded-lg border shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 p-6">
        <CheckCircleIcon
          className={`h-6 w-6 ${completed ? "text-green-500" : "text-blue-200"}`}
        />
        <div
          className={cn("flex-1 cursor-pointer space-y-1.5", headerClassName)}
          onClick={handleToggle}
        >
          <div>
            <h3 className="flex items-center gap-2 text-lg leading-none font-semibold tracking-tight">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm">{description}</p>
          </div>
        </div>
        {actionButton && !isExpanded && (
          <div onClick={handleToggle}>{actionButton}</div>
        )}
      </div>

      {isExpanded && <div className="p-6 pt-0">{children}</div>}
    </div>
  );
}
