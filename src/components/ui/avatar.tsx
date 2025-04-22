import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root> {
  variant?:
    | "default"
    | "neon"
    | "neon-blue"
    | "neon-pink"
    | "neon-purple"
    | "gradient"
    | "spotify";
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
}

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  AvatarProps
>(({ className, variant = "default", size = "md", ...props }, ref) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "neon":
        return "border-2 border-primary shadow-neon-glow";
      case "neon-blue":
        return "border-2 border-blue-500 shadow-neon-blue";
      case "neon-pink":
        return "border-2 border-pink-500 shadow-neon-pink";
      case "neon-purple":
        return "border-2 border-purple-500 shadow-neon-purple";
      case "gradient":
        return "border-none bg-gradient-to-r from-purple-600 to-blue-600 p-[2px]";
      case "spotify":
        return "border-2 border-spotify-green shadow-spotify-glow";
      default:
        return "border border-border";
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      case "xl":
        return "h-16 w-16";
      case "2xl":
        return "h-24 w-24";
      default: // md
        return "h-10 w-10";
    }
  };

  return (
    <AvatarPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full bg-spotify-dark-gray",
        getSizeClasses(),
        getVariantClasses(),
        className,
      )}
      {...props}
    />
  );
});
Avatar.displayName = AvatarPrimitive.Root.displayName;

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-spotify-dark-gray text-spotify-light-gray",
      className,
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

export { Avatar, AvatarImage, AvatarFallback };
