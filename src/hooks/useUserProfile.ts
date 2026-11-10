import { useState, useEffect, useCallback } from "react";
import type { UserProfile, UserStats } from "../types/url";
import { userService } from "../services/userService";

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileData, statsData] = await Promise.all([
        userService.getProfile(),
        userService.getStats(),
      ]);
      setProfile(profileData);
      setStats(statsData);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to load profile data",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // This effect intentionally starts the initial asynchronous data fetch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchData();
  }, [fetchData]);

  return { profile, stats, loading, error, refetch: fetchData };
};
