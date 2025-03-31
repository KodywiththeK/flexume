import { cn } from "@/lib/utils";
import React from "react";

export function Heading3({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={cn("text-base font-bold text-gray-800", className)}>
      {children}
    </h3>
  );
}
