import React from "react";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { Music, Headphones, Coins } from "lucide-react";
// Using direct imports with explicit paths
import firstImage from "../uiassets/FIRST.png";
import secondImage from "../uiassets/SECOND.png";
import thirdImage from "../uiassets/THIRD.png";

// Fallback images in case the imports fail
const fallbackImages = {
  first:
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=80",
  second:
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&q=80",
  third:
    "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&q=80",
};

interface LandingSectionProps {
  onGetStarted?: () => void;
}

const LandingSection: React.FC<LandingSectionProps> = ({ onGetStarted }) => {
  return (
    <div className="py-16 px-4 bg-gradient-to-b from-background/80 to-background relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[5%] left-[10%] w-72 h-72 rounded-full bg-primary/10 filter blur-3xl"></div>
        <div className="absolute bottom-[10%] right-[5%] w-80 h-80 rounded-full bg-secondary/10 filter blur-3xl"></div>
        <div className="absolute top-[40%] right-[20%] w-64 h-64 rounded-full bg-accent/10 filter blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-12 leading-tight">
          <span className="gradient-text">Welcome to</span> <br />
          LyricMate
        </h2>

        <p className="text-xl text-center text-gray-300 max-w-2xl mx-auto mb-16">
          The first decentralized music recognition platform with crypto rewards
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <FeatureCard
            icon={<Music className="w-8 h-8" />}
            title="Identify Any Song"
            description="Sing, speak, or type lyrics to instantly identify songs. Works with even partial lyrics or humming."
            image={firstImage || fallbackImages.first}
            color="primary"
          />

          <FeatureCard
            icon={<Headphones className="w-8 h-8" />}
            title="Smart Playback"
            description="Play songs from the beginning, from the exact lyrics you searched, or jump to the chorus."
            image={secondImage || fallbackImages.second}
            color="secondary"
          />

          <FeatureCard
            icon={<Coins className="w-8 h-8" />}
            title="Earn Crypto Rewards"
            description="Get rewarded with LYRIC tokens for identifying songs, contributing to our community, and daily engagement."
            image={thirdImage || fallbackImages.third}
            color="accent"
          />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mt-12">
          <Link to="/register">
            <Button
              variant="neon-gradient"
              size="xl"
              className="w-full sm:w-auto shadow-neon-glow"
              onClick={onGetStarted}
            >
              Get Started
            </Button>
          </Link>
          <Link to="/login">
            <Button
              variant="outline"
              size="xl"
              className="w-full sm:w-auto border-primary/50 hover:bg-primary/10 backdrop-blur-sm"
            >
              I Already Have an Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  image: string;
  color: "primary" | "secondary" | "accent";
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  image,
  color,
}) => {
  const getColorClasses = () => {
    switch (color) {
      case "primary":
        return "border-primary/30 bg-primary/5";
      case "secondary":
        return "border-secondary/30 bg-secondary/5";
      case "accent":
        return "border-accent/30 bg-accent/5";
      default:
        return "border-primary/30 bg-primary/5";
    }
  };

  const getIconColorClasses = () => {
    switch (color) {
      case "primary":
        return "bg-primary/20 text-primary";
      case "secondary":
        return "bg-secondary/20 text-secondary";
      case "accent":
        return "bg-accent/20 text-accent";
      default:
        return "bg-primary/20 text-primary";
    }
  };

  return (
    <div
      className={`rounded-2xl border ${getColorClasses()} p-6 backdrop-blur-sm card-hover`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className={`w-12 h-12 rounded-full ${getIconColorClasses()} flex items-center justify-center`}
        >
          {icon}
        </div>
        <h3 className="text-xl font-bold gradient-text">{title}</h3>
      </div>

      <p className="text-gray-300 mb-6 text-sm">{description}</p>

      <div className="rounded-xl overflow-hidden border border-white/10">
        <img
          src={image}
          alt={title}
          className="w-full h-auto object-cover"
          onError={(e) => {
            console.error(`Failed to load image: ${image}`);
            e.currentTarget.src = `https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&q=80`;
          }}
        />
      </div>
    </div>
  );
};

export default LandingSection;
