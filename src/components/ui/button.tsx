import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonVariants = cva("inline-flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition-[background-color,color,box-shadow,filter] duration-150 active:brightness-90 disabled:pointer-events-none disabled:opacity-45", {
  variants: { variant: {
    primary: "bg-[var(--forest)] text-white shadow-sm hover:bg-[var(--forest-deep)]",
    secondary: "border border-[var(--border)] bg-white text-[var(--forest)] hover:bg-[var(--surface-muted)]",
    harvest: "bg-[var(--harvest)] text-[var(--forest-deep)] shadow-sm hover:brightness-95",
    ghost: "text-[var(--forest)] hover:bg-[var(--surface-muted)]",
    danger: "bg-[var(--danger)] text-white hover:brightness-90",
  }, size: { default: "min-h-12", sm: "min-h-11 px-3", lg: "min-h-14 px-6 text-base", icon: "size-12 p-0" } },
  defaultVariants: { variant: "primary", size: "default" },
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}
export function Button({ className, variant, size, ...props }: ButtonProps) { return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />; }
