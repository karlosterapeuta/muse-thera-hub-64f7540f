
import React from "react";

export function UkuleleIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Guitar body */}
      <path d="M12 2c-1 0-2 0.5-2.5 1L7 8c-3 0.5-5 3-5 6 0 3.5 2.5 6 5 6l2 1.5c1.5 1.5 3.5 1.5 5 0l2-1.5c2.5 0 5-2.5 5-6 0-3-2-5.5-5-6L13.5 3C13 2.5 12 2 12 2z" />
      
      {/* Guitar neck */}
      <line x1="12" y1="8" x2="12" y2="2" />
      
      {/* Guitar strings */}
      <line x1="10" y1="14" x2="10" y2="9" />
      <line x1="12" y1="14" x2="12" y2="8" />
      <line x1="14" y1="14" x2="14" y2="9" />
      
      {/* Sound hole */}
      <circle cx="12" cy="14" r="2" />
      
      {/* Tuning pegs */}
      <circle cx="10.5" cy="1.5" r="0.5" />
      <circle cx="13.5" cy="1.5" r="0.5" />
      <circle cx="9.5" cy="3" r="0.5" />
      <circle cx="14.5" cy="3" r="0.5" />
    </svg>
  );
}
