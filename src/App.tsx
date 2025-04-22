import { Suspense, useEffect, useState } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import UserProfilePage from "./components/UserProfilePage";
import Login from "./components/Login";
import Register from "./components/Register";
import Welcome from "./components/onboarding/Welcome";
import Features from "./components/onboarding/Features";
import Connect from "./components/onboarding/Connect";
import Complete from "./components/onboarding/Complete";
import SongSearchPage from "./components/SongSearchPage";
import RewardsPage from "./components/RewardsPage";
import HistoryPage from "./components/HistoryPage";
import WalletPage from "./components/WalletPage";
import SimplePage from "./components/SimplePage";
import TestGeniusApi from "./components/TestGeniusApi";
import routes from "tempo-routes";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

function App() {
  // For tempo routes
  const tempoRoutes =
    import.meta.env.VITE_TEMPO === "true" ? useRoutes(routes) : null;

  return (
    <AuthProvider>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background/80 to-background">
            <div className="p-8 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 shadow-neon-glow">
              <p className="text-lg font-medium text-white">
                Loading LyricMate...
              </p>
            </div>
          </div>
        }
      >
        {import.meta.env.VITE_TEMPO === "true" && tempoRoutes}

        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recognize"
            element={
              <ProtectedRoute>
                <SongSearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rewards"
            element={
              <ProtectedRoute>
                <RewardsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <ProtectedRoute>
                <WalletPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/simple" element={<SimplePage />} />
          <Route path="/test-genius" element={<TestGeniusApi />} />

          {/* Onboarding Routes */}
          <Route path="/onboarding/welcome" element={<Welcome />} />
          <Route path="/onboarding/features" element={<Features />} />
          <Route path="/onboarding/connect" element={<Connect />} />
          <Route path="/onboarding/complete" element={<Complete />} />

          {/* Add this before any catchall route */}
          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" element={null} />
          )}

          {/* Redirect to home page if not found */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}

// Protected route component to handle authentication and onboarding
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  // Temporarily disable authentication for debugging
  return <>{children}</>;

  /* Original protected route logic - commented out for debugging
  const { user, loading } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<
    boolean | null
  >(null);

  useEffect(() => {
    // Check if user has completed onboarding
    const checkOnboardingStatus = () => {
      const onboardingCompleted = localStorage.getItem("onboardingCompleted");
      setHasCompletedOnboarding(onboardingCompleted === "true");
    };

    checkOnboardingStatus();

    // Set up a listener for storage changes (in case onboarding is completed in another tab)
    window.addEventListener("storage", checkOnboardingStatus);

    return () => {
      window.removeEventListener("storage", checkOnboardingStatus);
    };
  }, [user]); // Re-check when user changes

  // Show loading state while checking authentication or onboarding status
  if (loading || hasCompletedOnboarding === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background/80 to-background">
        <div className="p-8 rounded-lg bg-card/30 backdrop-blur-md border border-primary/20 shadow-neon-glow animate-pulse">
          <p className="text-lg font-medium text-white">Loading LyricMate...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Redirect to onboarding if not completed
  if (!hasCompletedOnboarding) {
    return <Navigate to="/onboarding/welcome" />;
  }

  // User is authenticated and has completed onboarding
  return <>{children}</>;
  */
}

export default App;
