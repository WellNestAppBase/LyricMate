/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Music player colors based on Figma design
        music: {
          primary: "#1DB954", // Spotify green
          secondary: "#1ED760", // Lighter green
          dark: "#121212", // Dark background
          darkAlt: "#181818", // Slightly lighter dark
          darkCard: "#282828", // Card background
          lightGray: "#B3B3B3", // Light gray text
          white: "#FFFFFF",
          black: "#000000",
          overlay: "rgba(0, 0, 0, 0.7)",
          gradient: "linear-gradient(180deg, #1DB954 0%, #1ED760 100%)",
        },
        // Keep existing neon colors
        neon: {
          pink: "#ff00ff",
          "pink-500": "#ff33ff",
          "pink-300": "#ff66ff",
          blue: "#00ffff",
          "blue-500": "#33ffff",
          "blue-300": "#66ffff",
          purple: "#9900ff",
          "purple-900": "#1a0033",
          "purple-800": "#240046",
          "purple-700": "#3c096c",
          "purple-600": "#5a189a",
          "purple-500": "#7b2cbf",
          "purple-400": "#9d4edd",
          "purple-300": "#c77dff",
          "purple-200": "#e0aaff",
        },
        spotify: {
          green: "#1DB954",
          black: "#191414",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
        "3xl": "2rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        glow: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.7 },
        },
        pulse: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%": { opacity: 0.8, transform: "scale(1.05)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        glow: "glow 2s ease-in-out infinite",
        pulse: "pulse 3s ease-in-out infinite",
      },
      backgroundImage: {
        "neon-gradient": "linear-gradient(to right, #ff00ff, #00ffff)",
        "neon-gradient-alt": "linear-gradient(to right, #9900ff, #00ffff)",
        "dark-gradient": "linear-gradient(to bottom, #1a0033, #000000)",
        "card-gradient":
          "linear-gradient(to bottom right, rgba(153, 0, 255, 0.3), rgba(0, 255, 255, 0.1))",
        "spotify-gradient": "linear-gradient(180deg, #1DB954 0%, #1ED760 100%)",
        "dark-spotify-gradient":
          "linear-gradient(180deg, rgba(29, 185, 84, 0.8) 0%, rgba(18, 18, 18, 1) 100%)",
      },
      boxShadow: {
        "neon-pink": "0 0 5px #ff00ff, 0 0 20px rgba(255, 0, 255, 0.5)",
        "neon-blue": "0 0 5px #00ffff, 0 0 20px rgba(0, 255, 255, 0.5)",
        "neon-purple": "0 0 5px #9900ff, 0 0 20px rgba(153, 0, 255, 0.5)",
        "neon-glow":
          "0 0 10px rgba(255, 0, 255, 0.5), 0 0 20px rgba(0, 255, 255, 0.3)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
