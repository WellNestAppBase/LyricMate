import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

/**
 * Hook to determine if a user is a first-time visitor to the app
 * @returns boolean indicating if this is the user's first time visiting the app
 */
export const useFirstTimeUser = (): boolean => {
  const [isFirstTimeUser, setIsFirstTimeUser] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    // Check if user has visited before using localStorage
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");

    // If user is not logged in and they're coming from a logout action
    const isFromLogout = localStorage.getItem("isFromLogout");

    if (isFromLogout === "true") {
      // Clear the logout flag
      localStorage.removeItem("isFromLogout");
      // Show landing page after logout
      setIsFirstTimeUser(true);
    } else if (hasVisitedBefore === "true") {
      setIsFirstTimeUser(false);
    } else {
      // Set the flag for future visits
      localStorage.setItem("hasVisitedBefore", "true");
      setIsFirstTimeUser(true);
    }
  }, [user]);

  return isFirstTimeUser;
};
