import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-2xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white shadow-md hover:bg-primary/90 transition-all duration-200",
        destructive:
          "bg-destructive text-white shadow-md hover:bg-destructive/90",
        outline:
          "border border-border bg-transparent text-foreground shadow-md hover:bg-muted/50 hover:text-foreground",
        secondary: "bg-secondary text-white shadow-md hover:bg-secondary/90",
        ghost: "hover:bg-muted/50 text-foreground/80 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gradient:
          "bg-gradient-to-r from-primary to-secondary text-white shadow-md hover:from-primary/90 hover:to-secondary/90 transition-all duration-200",
        "blue-gradient":
          "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all duration-200",
        "purple-gradient":
          "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md hover:from-purple-700 hover:to-pink-700 transition-all duration-200",
        "neon-gradient":
          "bg-neon-gradient text-white shadow-neon-glow hover:opacity-90 transition-all duration-200",
        "neon-gradient-alt":
          "bg-neon-gradient-alt text-white shadow-neon-glow hover:opacity-90 transition-all duration-200",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-xl px-3 text-xs",
        lg: "h-11 rounded-xl px-8 text-base",
        icon: "h-10 w-10",
        xl: "h-12 rounded-2xl px-10 text-lg font-bold",
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
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
