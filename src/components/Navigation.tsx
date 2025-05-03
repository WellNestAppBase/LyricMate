import { Link, useLocation } from "react-router-dom";
import { Home, User, Music, History, Wallet, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationProps {
  className?: string;
}

export default function Navigation({ className }: NavigationProps = {}) {
  const location = useLocation();

  const navItems = [
    {
      name: "Home",
      icon: <Home className="h-5 w-5" />,
      path: "/",
    },
    {
      name: "Profile",
      icon: <User className="h-5 w-5" />,
      path: "/profile",
    },
    {
      name: "Recognize",
      icon: <Music className="h-5 w-5" />,
      path: "/recognize",
      primary: true,
    },
    {
      name: "History",
      icon: <History className="h-5 w-5" />,
      path: "/history",
    },
    {
      name: "Wallet",
      icon: <Wallet className="h-5 w-5" />,
      path: "/wallet",
    },
  ];

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-card/30 backdrop-blur-md border-t border-white/10 py-2 px-4",
        className,
      )}
      style={{ position: "fixed", bottom: 0 }}
    >
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isPrimary = item.primary;

          return (
            <Link
              key={item.name}
              to={item.path}
              className={cn(
                "flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all",
                isPrimary
                  ? "bg-primary text-white shadow-neon-glow scale-110 -mt-6 px-4 py-3"
                  : isActive
                    ? "text-white"
                    : "text-gray-400 hover:text-white",
              )}
            >
              {item.icon}
              <span
                className={cn("text-xs font-medium", isPrimary && "font-bold")}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
