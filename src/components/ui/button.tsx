import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold cursor-pointer transition-all duration-150 ease-[var(--ease-out-soft)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground tracking-[0.04em] hover:bg-primary-dark hover:shadow-card",
        primary: "bg-primary text-primary-foreground tracking-[0.04em] hover:bg-primary-dark hover:shadow-card",
        secondary:
          "border-[1.5px] border-primary bg-card text-primary tracking-[0.04em] hover:bg-primary hover:text-primary-foreground",
        outline: "border border-border bg-transparent text-foreground hover:bg-secondary",
        dark: "bg-ink text-on-ink hover:bg-ink/90",
        onDark:
          "border-[1.5px] border-on-ink bg-transparent text-on-ink hover:border-primary-light hover:text-primary-light",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        ghost: "hover:bg-secondary hover:text-primary",
        link: "text-primary underline underline-offset-[3px] hover:text-primary-dark",

      },
      size: {
        default: "h-11 px-6 py-2",
        sm: "h-9 rounded-md px-4 text-sm",
        lg: "h-12 rounded-md px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
