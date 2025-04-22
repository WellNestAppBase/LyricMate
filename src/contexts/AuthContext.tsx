import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { ethers } from "ethers";

type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  provider?: string;
  walletAddress?: string;
  walletBalance?: string;
};

type UserUpdateData = Partial<User> & {
  file?: File;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  loginWithTwitter: () => Promise<void>;
  loginWithOTP: (email: string) => Promise<void>;
  verifyOTP: (email: string, token: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  updateUser: (userData: UserUpdateData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  refreshWalletBalance: () => Promise<void>;
  isWalletConnected: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { useAuth };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get session from Supabase
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (profile) {
            setUser({
              id: session.user.id,
              name: profile.name || session.user.email?.split("@")[0] || "User",
              email: session.user.email || "",
              avatarUrl: profile.avatar_url,
              provider: session.user.app_metadata.provider || "email",
            });
          } else {
            // Create a profile if it doesn't exist
            const newProfile = {
              id: session.user.id,
              name: session.user.email?.split("@")[0] || "User",
              avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.id}`,
            };

            await supabase.from("profiles").insert([newProfile]);

            setUser({
              id: session.user.id,
              name: newProfile.name,
              email: session.user.email || "",
              avatarUrl: newProfile.avatar_url,
              provider: session.user.app_metadata.provider || "email",
            });
          }
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.name || session.user.email?.split("@")[0] || "User",
            email: session.user.email || "",
            avatarUrl: profile.avatar_url,
            provider: session.user.app_metadata.provider || "email",
          });
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) throw signInError;

      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/profile`,
          skipBrowserRedirect: false,
        },
      });

      if (signInError) {
        console.error("Google login error:", signInError);
        throw signInError;
      }
    } catch (err: any) {
      console.error("Google login error:", err);
      setError(err.message || "Google login failed");
      setLoading(false);
      throw err; // Re-throw to allow handling in the UI
    }
  };

  const loginWithFacebook = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/profile`,
          skipBrowserRedirect: false,
        },
      });

      if (signInError) {
        console.error("Facebook login error:", signInError);
        throw signInError;
      }
    } catch (err: any) {
      console.error("Facebook login error:", err);
      setError(err.message || "Facebook login failed");
      setLoading(false);
      throw err; // Re-throw to allow handling in the UI
    }
  };

  const loginWithTwitter = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: "twitter",
        options: {
          redirectTo: `${window.location.origin}/profile`,
          skipBrowserRedirect: false,
        },
      });

      if (signInError) {
        console.error("Twitter login error:", signInError);
        throw signInError;
      }
    } catch (err: any) {
      console.error("Twitter login error:", err);
      setError(err.message || "Twitter login failed");
      setLoading(false);
      throw err; // Re-throw to allow handling in the UI
    }
  };

  const loginWithOTP = async (email: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/profile`,
        },
      });

      if (error) throw error;

      // Show success message to user
      return;
    } catch (err: any) {
      setError(err.message || "OTP login failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (email: string, token: string) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: "email",
      });

      if (error) throw error;

      navigate("/profile");
    } catch (err: any) {
      setError(err.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);

      // Register with Supabase
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        // Create a profile for the new user
        const avatarUrl = `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.toLowerCase().replace(/\s+/g, "")}`;

        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            name,
            avatar_url: avatarUrl,
          },
        ]);

        if (profileError) throw profileError;

        navigate("/profile");
      }
    } catch (err: any) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);

      // Set a flag to indicate the user is coming from logout
      localStorage.setItem("isFromLogout", "true");

      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const updateUser = async (userData: UserUpdateData) => {
    try {
      setLoading(true);
      setError(null);

      if (!user) {
        throw new Error("No user logged in");
      }

      // Validate input data
      if (userData.name !== undefined && !userData.name.trim()) {
        throw new Error("Display name cannot be empty");
      }

      let avatarUrl = userData.avatarUrl;

      // If a file is provided, upload it to Supabase Storage
      if (userData.file) {
        // Validate file size (max 5MB)
        if (userData.file.size > 5 * 1024 * 1024) {
          throw new Error("Image file size must be less than 5MB");
        }

        // Validate file type
        const validTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
        ];
        if (!validTypes.includes(userData.file.type)) {
          throw new Error("Only JPEG, PNG, GIF, and WebP images are supported");
        }

        const fileExt = userData.file.name.split(".").pop();
        const fileName = `${user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        // Upload the file
        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, userData.file, {
            upsert: true,
            contentType: userData.file.type,
          });

        if (uploadError) throw uploadError;

        // Get the public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("avatars").getPublicUrl(filePath);

        avatarUrl = publicUrl;
      }

      // Prepare update data
      const updateData: { name?: string; avatar_url?: string | null } = {};

      // Only include fields that are provided
      if (userData.name !== undefined) {
        updateData.name = userData.name.trim();
      }

      if (avatarUrl !== undefined) {
        updateData.avatar_url = avatarUrl;
      } else if (userData.avatarUrl !== undefined) {
        updateData.avatar_url = userData.avatarUrl.trim();
      }

      // Update the profile in Supabase
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updateData)
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Update the local user state
      setUser({
        ...user,
        name: userData.name !== undefined ? userData.name.trim() : user.name,
        avatarUrl: avatarUrl || userData.avatarUrl || user.avatarUrl,
      });

      console.log("Profile updated successfully:", {
        name: userData.name,
        avatarUrl: avatarUrl || userData.avatarUrl,
      });
    } catch (err: any) {
      console.error("Error updating profile:", err);
      setError(err.message || "Failed to update user");
      throw err; // Re-throw to allow handling in the UI
    } finally {
      setLoading(false);
    }
  };

  // Web3 wallet connection functions
  const connectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if MetaMask is installed
      if (!window.ethereum) {
        throw new Error(
          "MetaMask is not installed. Please install it to connect your wallet.",
        );
      }

      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();

      // Get ETH balance
      const balance = await provider.getBalance(address);
      const formattedBalance = ethers.utils.formatEther(balance);

      // Update user state with wallet info
      if (user) {
        // Update the user profile in Supabase
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            wallet_address: address,
          })
          .eq("id", user.id);

        if (updateError) throw updateError;

        // Update local user state
        setUser({
          ...user,
          walletAddress: address,
          walletBalance: formattedBalance,
        });
      }

      setIsWalletConnected(true);
    } catch (err: any) {
      console.error("Error connecting wallet:", err);
      setError(err.message || "Failed to connect wallet");
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user) {
        // Update the user profile in Supabase
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            wallet_address: null,
          })
          .eq("id", user.id);

        if (updateError) throw updateError;

        // Update local user state
        setUser({
          ...user,
          walletAddress: undefined,
          walletBalance: undefined,
        });
      }

      setIsWalletConnected(false);
    } catch (err: any) {
      console.error("Error disconnecting wallet:", err);
      setError(err.message || "Failed to disconnect wallet");
    } finally {
      setLoading(false);
    }
  };

  const refreshWalletBalance = async () => {
    try {
      if (!user?.walletAddress || !window.ethereum) return;

      setLoading(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balance = await provider.getBalance(user.walletAddress);
      const formattedBalance = ethers.utils.formatEther(balance);

      setUser({
        ...user,
        walletBalance: formattedBalance,
      });
    } catch (err: any) {
      console.error("Error refreshing wallet balance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check if wallet is already connected on component mount
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum && user?.walletAddress) {
        try {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const accounts = await provider.listAccounts();
          if (
            accounts.length > 0 &&
            accounts[0].toLowerCase() === user.walletAddress.toLowerCase()
          ) {
            setIsWalletConnected(true);
            refreshWalletBalance();
          }
        } catch (err) {
          console.error("Error checking wallet connection:", err);
        }
      }
    };

    if (user) {
      checkWalletConnection();
    }
  }, [user]);

  const value = {
    user,
    loading,
    error,
    login,
    loginWithGoogle,
    loginWithFacebook,
    loginWithTwitter,
    loginWithOTP,
    verifyOTP,
    register,
    updateUser,
    logout,
    clearError,
    connectWallet,
    disconnectWallet,
    refreshWalletBalance,
    isWalletConnected,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
