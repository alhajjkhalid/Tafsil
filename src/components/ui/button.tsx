"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "relative bg-gold text-navy font-arabic-body font-medium rounded-btn hover:bg-gold-light active:bg-gold-dark transition-colors duration-200 overflow-hidden",
  secondary:
    "border-2 border-navy text-navy bg-transparent font-arabic-body font-medium rounded-btn hover:bg-cream active:bg-cream-dark transition-colors duration-200",
  ghost:
    "text-navy font-arabic-body font-medium hover:bg-cream active:bg-cream-dark rounded-btn transition-colors duration-200",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      children,
      className = "",
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={`
          inline-flex items-center justify-center
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `.trim()}
        {...props}
      >
        {variant === "primary" && !disabled && (
          <span
            className="absolute inset-0 gold-shimmer pointer-events-none"
            aria-hidden="true"
          />
        )}
        <span className="relative z-10">{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
