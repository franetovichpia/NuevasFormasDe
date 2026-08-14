import type {
  ComponentPropsWithoutRef,
} from "react";

import { cn } from "@/utils/cn";

type ContainerProps =
  ComponentPropsWithoutRef<"div">;

export function Container({
  className,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "container-shell",
        className,
      )}
      {...props}
    />
  );
}
