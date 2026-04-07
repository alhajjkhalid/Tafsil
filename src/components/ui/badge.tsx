import React from "react";

type BadgeVariant = "gold" | "success" | "info" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  gold: "bg-gold/10 text-gold-dark",
  success: "bg-success/10 text-success",
  info: "bg-navy/10 text-navy",
  neutral: "bg-cream-dark text-navy/60",
};

function Badge({ children, variant = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center rounded-full px-3 py-1
        text-xs font-arabic-body font-medium
        ${variantClasses[variant]}
        ${className}
      `.trim()}
    >
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant };
