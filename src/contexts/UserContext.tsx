import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type {
  UserProfile,
  UserStats,
} from "../types/url";

import { userService } from "../services/userService";
import { useAuth } from "./AuthContext";

interface UserContextType {
  profile: UserProfile | null;
  stats: UserStats | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext =
  createContext<UserContextType | null>(null);

export const UserProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isAuthenticated, isInitialized } = useAuth();
  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [stats, setStats] =
    useState<UserStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const fetchUser = async () => {
    try {
      const [profileData, statsData] =
        await Promise.all([
          userService.getProfile(),
          userService.getStats(),
        ]);

      setProfile(profileData);

      setStats(statsData);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isInitialized && isAuthenticated) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [isInitialized, isAuthenticated]);

  return (
    <UserContext.Provider
      value={{
        profile,
        stats,
        loading,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be used within UserProvider"
    );
  }

  return context;
};