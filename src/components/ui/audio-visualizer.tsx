import * as React from "react";
import { cn } from "@/lib/utils";

interface AudioVisualizerProps extends React.HTMLAttributes<HTMLDivElement> {
  isActive?: boolean;
  barCount?: number;
  variant?: "default" | "circular" | "wave";
}

const AudioVisualizer = React.forwardRef<HTMLDivElement, AudioVisualizerProps>(
  (
    {
      className,
      isActive = false,
      barCount = 5,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const getRandomHeight = () => {
      return Math.floor(Math.random() * 20) + 5;
    };

    if (variant === "circular") {
      return (
        <div
          ref={ref}
          className={cn(
            "relative flex items-center justify-center h-16 w-16",
            className,
          )}
          {...props}
        >
          <div className="absolute inset-0 rounded-full border border-primary/30 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              {isActive &&
                Array.from({ length: 12 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute h-full w-1 bg-primary/20 origin-bottom"
                    style={{
                      transform: `rotate(${i * 30}deg) scaleY(${getRandomHeight() / 40})`,
                      animation: `pulse ${1 + Math.random() * 0.5}s ease-in-out infinite`,
                      animationDelay: `${i * 0.1}s`,
                      opacity: 0.7 + Math.random() * 0.3,
                    }}
                  />
                ))}
            </div>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
            <div
              className={cn(
                "h-10 w-10 rounded-full transition-all duration-300",
                isActive
                  ? "bg-primary shadow-neon-glow scale-100"
                  : "bg-gray-700 scale-90",
              )}
            />
          </div>
        </div>
      );
    }

    if (variant === "wave") {
      return (
        <div
          ref={ref}
          className={cn("flex items-center justify-center h-12", className)}
          {...props}
        >
          <svg
            width="100%"
            height="40"
            viewBox="0 0 200 40"
            preserveAspectRatio="none"
          >
            <path
              d="M0,20 Q25,5 50,20 T100,20 T150,20 T200,20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={cn(
                "transition-all duration-300",
                isActive ? "text-primary animate-wave" : "text-gray-700",
              )}
            />
          </svg>
        </div>
      );
    }

    // Default visualizer
    return (
      <div ref={ref} className={cn("music-wave", className)} {...props}>
        {Array.from({ length: barCount }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "music-wave-bar h-5",
              isActive ? "animate-wave" : "h-2 bg-gray-700",
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>
    );
  },
);

AudioVisualizer.displayName = "AudioVisualizer";

export { AudioVisualizer };
