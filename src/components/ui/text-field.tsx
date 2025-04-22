import * as React from "react";
import { cn } from "@/lib/utils";
import { Input, InputProps } from "./input";
import { Label } from "./label";

interface TextFieldProps extends Omit<InputProps, "ref"> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      className,
      label,
      helperText,
      error = false,
      errorText,
      startIcon,
      endIcon,
      fullWidth = false,
      variant = "spotify",
      ...props
    },
    ref,
  ) => {
    return (
      <div className={cn("space-y-2", fullWidth && "w-full", className)}>
        {label && (
          <Label
            htmlFor={props.id}
            className={cn(
              "text-sm font-medium tracking-wide",
              error ? "text-destructive" : "text-spotify-white",
            )}
          >
            {label}
          </Label>
        )}
        <div className="relative">
          {startIcon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-spotify-light-gray">
              {startIcon}
            </div>
          )}
          <Input
            ref={ref}
            variant={error ? "neon-pink" : variant}
            className={cn(
              startIcon && "pl-12",
              endIcon && "pr-12",
              fullWidth && "w-full",
              "font-medium",
            )}
            {...props}
          />
          {endIcon && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-spotify-light-gray">
              {endIcon}
            </div>
          )}
        </div>
        {(helperText || (error && errorText)) && (
          <p
            className={cn(
              "text-xs font-medium",
              error ? "text-destructive" : "text-spotify-light-gray",
            )}
          >
            {error ? errorText : helperText}
          </p>
        )}
      </div>
    );
  },
);

TextField.displayName = "TextField";

export { TextField };
