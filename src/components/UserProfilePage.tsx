import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  History,
  Wallet,
  Settings,
  Music,
  Award,
  LogOut,
  Save,
  Upload,
  Image,
  Link,
  ExternalLink,
  RefreshCw,
  Download,
  Heart,
  Home,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import Navigation from "./Navigation";

export default function UserProfilePage() {
  const navigate = useNavigate();
  const {
    user: authUser,
    logout,
    updateUser,
    loading,
    connectWallet,
    disconnectWallet,
    refreshWalletBalance,
    isWalletConnected,
  } = useAuth();

  return (
    <div className="min-h-screen bg-background text-white py-6 px-4 pb-20 overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary/20 filter blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-72 h-72 rounded-full bg-secondary/20 filter blur-3xl"></div>
        <div className="absolute top-[40%] right-[15%] w-48 h-48 rounded-full bg-accent/20 filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Profile Image and Name */}
        <div className="pt-7 px-7">
          <div className="flex items-center">
            <Avatar className="w-20 h-20 rounded-full">
              <AvatarImage
                src={
                  authUser?.avatarUrl ||
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80"
                }
                alt={authUser?.name || "User"}
              />
              <AvatarFallback>
                {(authUser?.name || "User").substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="ml-5">
              <div className="text-white text-2xl font-medium capitalize">
                {authUser?.name || "Mahla Mehri"}
              </div>
              <div className="text-white/30 text-base lowercase">
                @{authUser?.email?.split("@")[0] || "musicvibe13.com"}
              </div>
            </div>
          </div>
        </div>

        {/* Phone Preview */}
        <div className="mt-10 relative">
          <div className="absolute right-0 top-10 w-[281.89px] h-[607.32px] origin-top-left rotate-[-10.35deg] rounded-3xl shadow-[0px_2px_16px_0px_rgba(255,255,255,0.25)] border border-[#7429a8] bg-[#0d1420] z-10 overflow-hidden">
            <div className="p-4 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="text-xl font-medium">Without me</div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 rounded-full border border-[#7429a8]"></div>
                  <div className="w-4 h-4 rounded-full border border-[#7429a8]"></div>
                </div>
              </div>
              <div className="text-white/50 text-sm">Halsey</div>
              <div className="flex justify-center my-6">
                <div className="w-[200px] h-[200px] rounded-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80"
                    alt="Album cover"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="mt-4 text-center text-white/70">
                <div className="text-sm">
                  Tell me how's it feel sittin' up there
                </div>
                <div className="text-sm">
                  Feeling so high but too far away to hold me
                </div>
                <div className="text-sm">
                  You know I'm the one who put you up there
                </div>
              </div>
              <div className="flex justify-center space-x-6 mt-8">
                <button className="p-2 bg-white/10 rounded-full">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 18L9 12L15 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button className="p-3 bg-pink-500 rounded-full">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M5 3L19 12L5 21V3Z" fill="white" />
                  </svg>
                </button>
                <button className="p-2 bg-white/10 rounded-full">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9 18L15 12L9 6"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                <button className="p-2 bg-white/10 rounded-full">
                  <Home className="h-5 w-5 text-white" />
                </button>
                <button className="p-2 bg-white/10 rounded-full">
                  <User className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>
          <div className="absolute right-2 top-0 w-[281.89px] h-[607.32px] origin-top-left rotate-[-10.12deg] rounded-3xl border border-[#7429a8] bg-[#0d1420]"></div>

          {/* Navigation Menu */}
          <nav className="ml-7 space-y-12">
            <div className="flex items-center text-white cursor-pointer hover:text-purple-400 transition-colors">
              <User className="h-6 w-6 mr-5 text-white/70" />
              <span className="text-base font-medium capitalize">Artists</span>
            </div>

            <div className="flex items-center text-white cursor-pointer hover:text-purple-400 transition-colors">
              <Heart className="h-6 w-6 mr-5 text-white/70" />
              <span className="text-base font-medium capitalize">
                Favorites
              </span>
            </div>

            <div className="flex items-center text-white cursor-pointer hover:text-purple-400 transition-colors">
              <Download className="h-6 w-6 mr-5 text-white/70" />
              <span className="text-base font-medium capitalize">
                Downloads
              </span>
            </div>

            <div className="flex items-center text-white cursor-pointer hover:text-purple-400 transition-colors">
              <History className="h-6 w-6 mr-5 text-white/70" />
              <span className="text-base font-medium capitalize">
                Recent History
              </span>
            </div>

            <div className="flex items-center text-white cursor-pointer hover:text-purple-400 transition-colors">
              <Music className="h-6 w-6 mr-5 text-white/70" />
              <span className="text-base font-medium capitalize">Albums</span>
            </div>

            <div className="flex items-center text-white cursor-pointer hover:text-purple-400 transition-colors">
              <Music className="h-6 w-6 mr-5 text-white/70" />
              <span className="text-base font-medium capitalize">Songs</span>
            </div>

            <div className="flex items-center text-white cursor-pointer hover:text-purple-400 transition-colors">
              <Settings className="h-6 w-6 mr-5 text-white/70" />
              <span className="text-base font-medium capitalize">Setting</span>
            </div>
          </nav>

          {/* Log Out Button */}
          <div
            className="ml-7 mt-12 flex items-center text-white cursor-pointer hover:text-red-400 transition-colors"
            onClick={async () => {
              await logout();
              navigate("/");
            }}
          >
            <LogOut className="h-6 w-6 mr-5 text-white/70" />
            <span className="text-base font-medium capitalize">Log Out</span>
          </div>
        </div>
      </div>

      <Navigation />
    </div>
  );
}
