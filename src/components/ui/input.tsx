import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?:
    | "default"
    | "neon"
    | "neon-blue"
    | "neon-pink"
    | "spotify"
    | "search";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = "default", ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "neon":
          return "border-primary bg-background/80 focus-visible:ring-primary/50 placeholder:text-muted-foreground text-foreground shadow-neon-glow";
        case "neon-blue":
          return "border-secondary bg-background/80 focus-visible:ring-secondary/50 placeholder:text-muted-foreground text-foreground shadow-neon-blue";
        case "neon-pink":
          return "border-accent bg-background/80 focus-visible:ring-accent/50 placeholder:text-muted-foreground text-foreground shadow-neon-pink";
        case "spotify":
          return "border-spotify-green bg-spotify-dark-gray/90 focus-visible:ring-spotify-green/50 placeholder:text-spotify-light-gray text-spotify-white shadow-spotify-glow";
        case "search":
          return "border-transparent bg-[#1e1e1e]/80 focus-visible:ring-pink-500/50 placeholder:text-white/50 text-white";
        default:
          return "border-input bg-background/80 focus-visible:ring-primary placeholder:text-muted-foreground text-foreground";
      }
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-full border px-5 py-3 text-base shadow-md backdrop-blur-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
          getVariantClasses(),
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
