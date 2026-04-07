"use client";

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
}

function Card({ children, className = "", selected = false, onClick }: CardProps) {
  return (
    <div
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`
        bg-white rounded-card shadow-sm p-6 transition-all duration-200
        ${selected ? "ring-2 ring-gold shadow-md" : ""}
        ${onClick ? "hover:shadow-md cursor-pointer" : ""}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}

export { Card };
export type { CardProps };
