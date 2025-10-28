import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  const variantClass = {
    primary:
      "bg-brandBlue-700 text-white hover:bg-brandBlue-800 focus-visible:ring-brandGold-400",
    secondary:
      "bg-brandTeal-100 text-brandTeal-900 hover:bg-brandTeal-200 focus-visible:ring-brandTeal-500",
    ghost: "bg-transparent text-brandBlue-700 hover:bg-brandBlue-50 focus-visible:ring-brandBlue-200",
  }[variant];

  const sizeClass = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  }[size];

  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-md font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
        variantClass,
        sizeClass,
        className,
      )}
      {...props}
    />
  );
}
