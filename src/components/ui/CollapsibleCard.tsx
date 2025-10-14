"use client";

import { useState, type ReactNode } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "~/components/ui/card";
import { cn } from "~/lib/utils";

interface CollapsibleCardProps {
  title: string;
  description: string;
  actionButton?: ReactNode;
  children: ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  actionButtonVariant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  actionButtonSize?: "default" | "sm" | "lg" | "icon";
  actionButtonDisabled?: boolean;
  actionButtonLoading?: boolean;
  actionButtonLoadingText?: string;
  disabled?: boolean;
}

export function CollapsibleCard({
  title,
  description,
  children,
  className,
  headerClassName,
  actionButton,
  disabled,
}: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    if (disabled) return;
    setIsExpanded(!isExpanded);
  };

  return (
    <Card className={className}>
      <CardHeader
        className={cn("cursor-pointer", headerClassName)}
        onClick={handleToggle}
      >
        <CardTitle className="flex items-center gap-2">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {actionButton && !isExpanded && (
          <CardAction onClick={handleToggle}>{actionButton}</CardAction>
        )}
      </CardHeader>

      {isExpanded && <CardContent>{children}</CardContent>}
    </Card>
  );
}
