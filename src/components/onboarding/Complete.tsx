import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import OnboardingLayout from "./OnboardingLayout";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Complete() {
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title="You're All Set!"
      subtitle="Ready to start your musical journey"
      backgroundImage="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80"
    >
      <CardContent className="p-6 space-y-6">
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center">
            <motion.div
              className="w-24 h-24 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center shadow-neon-glow"
              initial={{ scale: 0, rotate: -180 }}
              animate={{
                scale: 1,
                rotate: 0,
                boxShadow: [
                  "0 0 10px rgba(34, 197, 94, 0.5)",
                  "0 0 20px rgba(34, 197, 94, 0.5)",
                  "0 0 10px rgba(34, 197, 94, 0.5)",
                ],
              }}
              transition={{
                duration: 0.8,
                type: "spring",
                stiffness: 100,
                boxShadow: {
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut",
                },
              }}
            >
              <CheckCircle className="h-12 w-12 text-white" />
            </motion.div>
          </div>

          <motion.h2
            className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            Onboarding Complete
          </motion.h2>

          <motion.p
            className="text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            You're ready to start identifying songs and earning rewards with
            LyricMate
          </motion.p>
        </motion.div>

        <motion.div
          className="space-y-3 pt-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 backdrop-blur-sm hover:border-green-500/30 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg">
            <div className="flex items-center gap-3">
              <div className="bg-green-600/20 p-2 rounded-full">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">
                  Welcome Bonus
                </h3>
                <p className="text-xs text-gray-400">
                  You've received 5 LYRIC tokens
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <Button
            onClick={() => {
              // Set onboarding as completed in localStorage
              localStorage.setItem("onboardingCompleted", "true");
              // Navigate to home page
              navigate("/");
            }}
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-neon-glow hover:shadow-neon-glow-intense transition-all duration-300 transform hover:scale-[1.02]"
            size="lg"
          >
            Start Exploring
          </Button>
        </motion.div>
      </CardContent>
    </OnboardingLayout>
  );
}
