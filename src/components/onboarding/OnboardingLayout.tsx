import { ReactNode } from "react";
import { Card } from "../ui/card";

interface OnboardingLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
  title: string;
  subtitle?: string;
}

export default function OnboardingLayout({
  children,
  backgroundImage = "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=1200&q=80&auto=format",
  title,
  subtitle,
}: OnboardingLayoutProps) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-black overflow-hidden relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
            {title}
          </h1>
          {subtitle && <p className="text-gray-300 text-sm">{subtitle}</p>}
        </div>

        <Card className="border-none shadow-lg bg-black/80 backdrop-blur-md border-gray-800">
          {children}
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} LyricMate. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
