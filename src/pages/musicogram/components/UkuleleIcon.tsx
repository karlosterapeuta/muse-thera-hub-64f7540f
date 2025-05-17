
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
      {/* Ukulele body */}
      <path d="M8 10c0 2.5 1.5 4.5 4 5l1 2c2 2 5 2 7 0s2-5 0-7l-2-1c-.5-2.5-2.5-4-5-4-2.76 0-5 2.24-5 5z" />
      {/* Neck */}
      <path d="M8 10L3 5" />
      {/* Tuning pegs */}
      <circle cx="2" cy="4" r="1" />
      <circle cx="4" cy="2" r="1" />
      {/* Strings */}
      <line x1="13" y1="16" x2="7.5" y2="10.5" />
      <line x1="15" y1="14" x2="9.5" y2="8.5" />
    </svg>
  );
}
