import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import OnboardingLayout from "./OnboardingLayout";
import { Music, Mic, Headphones } from "lucide-react";

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="Welcome to LyricMate"
      subtitle="Your decentralized music companion"
      backgroundImage="https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=1200&q=80"
    >
      <CardContent className="p-6 space-y-6">
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center shadow-lg animate-pulse">
              <Music className="h-12 w-12 text-white" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-center text-white">
            Discover Music Like Never Before
          </h2>

          <p className="text-gray-300 text-center">
            Identify songs, earn rewards, and connect with a community of music
            lovers
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600/20 p-2 rounded-full">
                <Mic className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">
                  Identify Songs
                </h3>
                <p className="text-xs text-gray-400">
                  By singing, speaking, or typing lyrics
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600/20 p-2 rounded-full">
                <Headphones className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Earn Rewards</h3>
                <p className="text-xs text-gray-400">
                  Get LYRIC tokens for every interaction
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button
            onClick={() => navigate("/onboarding/features")}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
            size="lg"
          >
            Get Started
          </Button>
        </div>
      </CardContent>
    </OnboardingLayout>
  );
}
