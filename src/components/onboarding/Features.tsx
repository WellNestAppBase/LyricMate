import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import OnboardingLayout from "./OnboardingLayout";
import { Music, Mic, MessageSquare, Wallet } from "lucide-react";
import { motion } from "framer-motion";

export default function Features() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="Key Features"
      subtitle="Discover what makes LyricMate special"
      backgroundImage="https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=1200&q=80"
    >
      <CardContent className="p-6 space-y-6">
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <FeatureCard
                icon={<Mic className="h-6 w-6 text-purple-400" />}
                title="Multiple Input Methods"
                description="Sing, speak, or type lyrics to identify songs"
                color="purple"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <FeatureCard
                icon={<Music className="h-6 w-6 text-blue-400" />}
                title="Smart Playback"
                description="Play from the beginning, matched lyrics, or chorus"
                color="blue"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <FeatureCard
                icon={<Wallet className="h-6 w-6 text-pink-400" />}
                title="Crypto Rewards"
                description="Earn LYRIC tokens for every interaction"
                color="pink"
              />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="flex gap-3 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Button
            onClick={() => navigate("/onboarding/welcome")}
            variant="outline"
            className="flex-1 border-gray-700 hover:bg-gray-800 hover:text-white transition-all duration-300"
          >
            Back
          </Button>
          <Button
            onClick={() => navigate("/onboarding/connect")}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-neon-glow hover:shadow-neon-glow-intense transition-all duration-300"
          >
            Next
          </Button>
        </motion.div>
      </CardContent>
    </OnboardingLayout>
  );
}

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "purple" | "blue" | "pink";
}

function FeatureCard({ icon, title, description, color }: FeatureCardProps) {
  const bgColor = {
    purple: "bg-purple-600/20",
    blue: "bg-blue-600/20",
    pink: "bg-pink-600/20",
  }[color];

  const borderColor = {
    purple: "border-purple-600/30",
    blue: "border-blue-600/30",
    pink: "border-pink-600/30",
  }[color];

  const hoverBorderColor = {
    purple: "hover:border-purple-500/50",
    blue: "hover:border-blue-500/50",
    pink: "hover:border-pink-500/50",
  }[color];

  const hoverBgColor = {
    purple: "hover:bg-purple-600/30",
    blue: "hover:bg-blue-600/30",
    pink: "hover:bg-pink-600/30",
  }[color];

  return (
    <div
      className={`p-4 rounded-lg bg-gray-800/50 border ${borderColor} ${hoverBorderColor} ${hoverBgColor} backdrop-blur-sm transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`${bgColor} p-3 rounded-full transition-all duration-300`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-sm font-medium text-white">{title}</h3>
          <p className="text-xs text-gray-400">{description}</p>
        </div>
      </div>
    </div>
  );
}
