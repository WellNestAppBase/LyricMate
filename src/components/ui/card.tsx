import * as React from "react";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?:
    | "default"
    | "neon"
    | "gradient"
    | "dark"
    | "neon-blue"
    | "neon-pink"
    | "neon-purple";
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "neon":
          return "border border-primary/50 bg-black/80 shadow-neon-glow backdrop-blur-md";
        case "neon-blue":
          return "border border-blue-500/50 bg-black/80 shadow-neon-blue backdrop-blur-md";
        case "neon-pink":
          return "border border-pink-500/50 bg-black/80 shadow-neon-pink backdrop-blur-md";
        case "neon-purple":
          return "border border-purple-500/50 bg-black/80 shadow-neon-purple backdrop-blur-md";
        case "gradient":
          return "border-none bg-gradient-to-br from-purple-600/90 to-blue-600/90 shadow-neon-glow backdrop-blur-md";
        case "dark":
          return "border border-gray-800 bg-black/90 shadow-lg backdrop-blur-md";
        default:
          return "border border-border/30 bg-card/80 shadow-lg backdrop-blur-sm";
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-xl text-card-foreground",
          getVariantClasses(),
          className,
        )}
        {...props}
      />
    );
  },
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6 rounded-t-xl", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "font-bold leading-none tracking-tight text-xl text-foreground",
      className,
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground text-opacity-90", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center p-6 pt-0 border-t border-border/20",
      className,
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
