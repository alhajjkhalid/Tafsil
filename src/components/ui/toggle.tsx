"use client";

import React from "react";

interface ToggleOption {
  value: string;
  label: string;
}

interface ToggleProps {
  options: ToggleOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

function Toggle({ options, value, onChange, className = "" }: ToggleProps) {
  return (
    <div
      className={`inline-flex bg-cream rounded-full p-1 ${className}`}
      role="radiogroup"
    >
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={`
              px-5 py-2 rounded-full text-sm font-arabic-body font-medium
              transition-all duration-200 cursor-pointer
              ${
                isActive
                  ? "bg-gold text-navy shadow-sm"
                  : "text-navy/60 hover:text-navy"
              }
            `.trim()}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export { Toggle };
export type { ToggleProps, ToggleOption };
