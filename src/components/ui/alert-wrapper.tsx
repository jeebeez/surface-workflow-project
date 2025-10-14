import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import type { VariantProps } from "class-variance-authority";
import type { alertVariants } from "./alert";

interface AlertWrapperProps
  extends Omit<React.ComponentProps<"div">, "title">,
    VariantProps<typeof alertVariants> {
  icon?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
}



export function AlertWrapper({
  icon: Icon,
  title,
  description,
  variant,
  className,
  children,
  ...props
}: AlertWrapperProps & React.ComponentProps<typeof Alert>) {

  return (
    <Alert variant={variant} className={className} {...props}>
      {Icon && Icon}
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
      {children}
    </Alert>
  );
}
