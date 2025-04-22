import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "../contexts/AuthContext";
import { WalletCard } from "./WalletCard";
import {
  User,
  Heart,
  Download,
  History,
  Album,
  Music,
  Settings,
  LogOut,
  Home,
  Search,
  Star,
} from "lucide-react";

export default function UserAccountPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<string>("profile");

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const menuItems = [
    {
      id: "artists",
      label: "Artists",
      icon: <User size={24} className="text-purple-400" />,
    },
    {
      id: "favorites",
      label: "Favorites",
      icon: <Heart size={24} className="text-pink-400" />,
    },
    {
      id: "downloads",
      label: "Downloads",
      icon: <Download size={24} className="text-blue-400" />,
    },
    {
      id: "history",
      label: "Recent History",
      icon: <History size={24} className="text-indigo-400" />,
    },
    {
      id: "albums",
      label: "Albums",
      icon: <Album size={24} className="text-green-400" />,
    },
    {
      id: "songs",
      label: "Songs",
      icon: <Music size={24} className="text-yellow-400" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={24} className="text-gray-400" />,
    },
  ];

  // Content to display based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "wallet":
        return <WalletCard />;
      default:
        return (
          <div className="relative w-full">
            <div className="absolute top-0 right-0 w-[280px] h-[600px] bg-[#1a1a2e] rounded-3xl border border-[#7429a8] shadow-lg transform rotate-[-10deg] overflow-hidden">
              {/* Phone Content Preview */}
              <div className="p-4 h-full flex flex-col">
                <div className="text-xl font-bold mb-2">Without me</div>
                <div className="text-sm text-gray-400 mb-4">Halsey</div>
                <div className="flex-1 flex items-center justify-center">
                  <img
                    src="https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&q=80"
                    alt="Album Cover"
                    className="w-48 h-48 rounded-full object-cover border-2 border-purple-500"
                  />
                </div>
                <div className="mt-4 space-y-2 text-sm text-gray-400">
                  <p>Tell me how's it feel sittin' up there?</p>
                  <p className="text-white">
                    Feeling so high but too far away to hold me
                  </p>
                  <p>You know I'm the one who put you up there</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-[#0d1420] text-white flex flex-col">
      {/* Profile Header */}
      <div className="p-6 flex items-center space-x-4">
        <div className="relative">
          <img
            src={
              user?.avatarUrl ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || "default"}`
            }
            alt="Profile"
            className="w-20 h-20 rounded-full border-2 border-purple-500"
          />
          <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1 cursor-pointer">
            <Settings size={16} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-medium capitalize">
            {user?.name || "Mahla Mehri"}
          </h2>
          <p className="text-white/30 text-sm">
            @{user?.email?.split("@")[0] || "musicvibe13.com"}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Left Menu */}
        <div className="w-full p-4 space-y-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`flex items-center space-x-4 w-full p-2 rounded-lg transition-colors ${activeTab === item.id ? "bg-purple-900/30" : "hover:bg-white/5"}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.icon}
              <span className="text-base font-medium">{item.label}</span>
            </button>
          ))}

          {/* Wallet Button */}
          <button
            className={`flex items-center space-x-4 w-full p-2 rounded-lg transition-colors ${activeTab === "wallet" ? "bg-purple-900/30" : "hover:bg-white/5"}`}
            onClick={() => setActiveTab("wallet")}
          >
            <Star size={24} className="text-amber-400" />
            <span className="text-base font-medium">LYRIC Wallet</span>
          </button>

          {/* Logout Button */}
          <button
            className="flex items-center space-x-4 w-full p-2 rounded-lg text-red-400 hover:bg-white/5 transition-colors mt-12"
            onClick={handleLogout}
          >
            <LogOut size={24} />
            <span className="text-base font-medium">Log Out</span>
          </button>
        </div>

        {/* Right Content */}
        <div className="hidden md:block relative w-1/2">{renderContent()}</div>
      </div>

      {/* Bottom Navigation */}
      <div className="sticky bottom-0 left-0 right-0 p-4">
        <div className="bg-gray-900/30 backdrop-blur-sm rounded-full border border-purple-900 py-2 px-4">
          <div className="flex justify-around items-center">
            <Button
              variant="ghost"
              size="icon"
              className="text-white rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              <Home size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => navigate("/search")}
            >
              <Search size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white rounded-full bg-white/20 hover:bg-white/30"
            >
              <User size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="text-white rounded-full bg-white/10 hover:bg-white/20"
              onClick={() => navigate("/favorites")}
            >
              <Heart size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
