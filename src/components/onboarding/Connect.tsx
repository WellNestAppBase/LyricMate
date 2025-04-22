import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { CardContent } from "../ui/card";
import OnboardingLayout from "./OnboardingLayout";
import { Wallet, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Connect() {
  const navigate = useNavigate();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    // Simulate connection process
    setTimeout(() => {
      setConnecting(false);
      navigate("/onboarding/complete");
    }, 1500);
  };

  return (
    <OnboardingLayout
      title="Connect Your Wallet"
      subtitle="Earn and store LYRIC tokens"
      backgroundImage="https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=1200&q=80"
    >
      <CardContent className="p-6 space-y-6">
        <motion.div
          className="space-y-4 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center">
            <motion.div
              className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-neon-glow"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 200,
              }}
            >
              <Wallet className="h-10 w-10 text-white" />
            </motion.div>
          </div>

          <div>
            <h2 className="text-xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
              Blockchain Integration
            </h2>
            <p className="text-gray-300 text-sm mt-1">
              Connect your wallet to start earning LYRIC tokens
            </p>
          </div>
        </motion.div>

        <div className="space-y-4 pt-2">
          <motion.div
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-between backdrop-blur-sm hover:border-gray-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/identicon/svg?seed=metamask"
                alt="MetaMask"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <h3 className="text-sm font-medium text-white">MetaMask</h3>
                <p className="text-xs text-gray-400">Connect to Ethereum</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? "Connecting..." : "Connect"}
            </Button>
          </motion.div>

          <motion.div
            className="p-4 rounded-lg bg-gray-800/50 border border-gray-700 flex items-center justify-between backdrop-blur-sm hover:border-gray-500 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="flex items-center gap-3">
              <img
                src="https://api.dicebear.com/7.x/identicon/svg?seed=phantom"
                alt="Phantom"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-left">
                <h3 className="text-sm font-medium text-white">Phantom</h3>
                <p className="text-xs text-gray-400">Connect to Solana</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-all duration-300"
              onClick={handleConnect}
              disabled={connecting}
            >
              {connecting ? "Connecting..." : "Connect"}
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="flex gap-3 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Button
            onClick={() => navigate("/onboarding/features")}
            variant="outline"
            className="flex-1 border-gray-700 hover:bg-gray-800 hover:text-white transition-all duration-300"
            disabled={connecting}
          >
            Back
          </Button>
          <Button
            onClick={() => navigate("/onboarding/complete")}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-neon-glow hover:shadow-neon-glow-intense transition-all duration-300"
            disabled={connecting}
          >
            Skip <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </CardContent>
    </OnboardingLayout>
  );
}
