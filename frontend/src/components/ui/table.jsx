import React from "react";

export function Badge({
  children,
  variant = "default",
  className = "",
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium border ${className}`}
      data-variant={variant}
    >
      {children}
    </span>
  );
}