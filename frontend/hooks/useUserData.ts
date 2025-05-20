import { useEffect, useState } from "react";
import { useUserStore } from "../store/userStore";

export const useUserData = (address: string | undefined) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setUserData } = useUserStore();

  const fetchUserData = async () => {
    if (!address) return;

    setIsLoading(true);
    setError(null);

    try {
      // First check if user has a grove
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/grove/check`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ address }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user data");
      }

      // If user has a grove, fetch their Lens profile
      if (data.hasGrove) {
        const lensResponse = await fetch(
          `https://api.web3.bio/profile/lens/${address}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const lensData = await lensResponse.json();

        if (!lensResponse.ok) {
          throw new Error("Failed to fetch Lens profile");
        }

        // Save all user data to Zustand store
        setUserData(address, lensData.identity || "Anonymous", data.groveId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching user data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (address) {
      fetchUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  return {
    isLoading,
    error,
    refetch: fetchUserData,
  };
};
