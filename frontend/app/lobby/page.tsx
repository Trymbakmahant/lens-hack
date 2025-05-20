"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ConnectKitButton } from "connectkit";
import { useAccount } from "wagmi";
import Image from "next/image";
// import LensProfileCard from "../components/LensProfileCard";

interface LensProfile {
  handle: string;

  picture: string;
}

// // Mock data for public games - replace with actual data from your backend
// const mockPublicGames = [
//   {
//     id: "abc123",
//     name: "Village Night",
//     players: 4,
//     maxPlayers: 8,
//     status: "waiting",
//   },
//   {
//     id: "def456",
//     name: "Wolf Pack",
//     players: 6,
//     maxPlayers: 10,
//     status: "waiting",
//   },
//   {
//     id: "ghi789",
//     name: "Mystery Manor",
//     players: 3,
//     maxPlayers: 8,
//     status: "waiting",
//   },
// ];

export default function LobbyPage() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [lensProfile, setLensProfile] = useState<LensProfile | null>(null);
  const [isLensProfileLoading, setIsLensProfileLoading] = useState(false);
  const [gameStatus, setGameStatus] = useState<{
    hasActiveGame: boolean;
    gameId: string | null;
    availableSlots: number;
  }>({
    hasActiveGame: false,
    gameId: null,
    availableSlots: 0,
  });

  useEffect(() => {
    if (isConnected && address) {
      fetchLensProfile();
      checkGameStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  const fetchLensProfile = async () => {
    setIsLensProfileLoading(true);
    try {
      const response = await fetch(
        `https://api.web3.bio/profile/lens/${address}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      console.log(data, "data");

      if (!response.ok) {
        console.error("Error fetching profile:", data.error);
        return;
      }

      if (data.identity) {
        setLensProfile({
          handle: data.identity,

          picture: data.avatar,
        });
        console.log(lensProfile, "lensProfile");
        setIsLensProfileLoading(false);
      } else {
        console.log("No Lens profile found for this address");
      }
    } catch (error) {
      console.error("Error fetching Lens profile:", error);
    }
  };

  const checkGameStatus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/game/status?address=${address}`);
      const data = await response.json();

      setGameStatus({
        hasActiveGame: data.hasActiveGame,
        gameId: data.gameId,
        availableSlots: data.availableSlots,
      });

      if (data.hasActiveGame && data.availableSlots > 0) {
        handleJoinGame(data.gameId);
      }
    } catch (error) {
      console.error("Error checking game status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/game/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });
      const data = await response.json();

      if (data.gameId) {
        router.push(`/game/${data.gameId}`);
      }
    } catch (error) {
      console.error("Error creating game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGame = async (gameId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/game/join", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, address }),
      });
      const data = await response.json();

      if (data.success) {
        router.push(`/game/${gameId}`);
      }
    } catch (error) {
      console.error("Error joining game:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF5E6] text-[#4A4A4A] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#8B7355]">
          Game Lobby
        </h1>

        <div className="wallet-section mb-8 flex justify-center">
          <ConnectKitButton />
        </div>

        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-[#EADBC8] p-8 relative overflow-hidden">
            {/* Loading overlay */}
            {(isLensProfileLoading || isLoading) && (
              <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 rounded-3xl">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B7355]"></div>
              </div>
            )}

            {/* Profile or No Profile */}
            {lensProfile ? (
              <div className="flex flex-col items-center">
                <div className="relative mb-4">
                  <Image
                    src={lensProfile.picture || "/person.png"}
                    alt={lensProfile.handle}
                    className="w-24 h-24 rounded-full border-4 border-[#8B7355] bg-[#FFF5E6] object-cover shadow"
                    width={96}
                    height={96}
                  />
                  <Image
                    src="/lens.jpeg"
                    alt="Lens Logo"
                    className="absolute -bottom-3 -right-3 w-10 h-10 bg-white rounded-full border-2 border-[#EADBC8] p-1"
                    width={40}
                    height={40}
                  />
                </div>
                <h2 className="text-3xl font-extrabold text-[#8B7355] mb-1">
                  {lensProfile.handle}
                </h2>
                <p className="text-[#6B5B4E] mb-4">
                  Welcome to Lens Game Lobby!
                </p>
                <hr className="w-2/3 border-[#EADBC8] my-4" />

                {/* Game Status */}
                {gameStatus.hasActiveGame ? (
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#8B7355] mb-2">
                      Active Game Found
                    </h3>
                    <p className="mb-4 text-[#6B5B4E]">
                      Available slots: {gameStatus.availableSlots}
                    </p>
                    <button
                      onClick={() => handleJoinGame(gameStatus.gameId!)}
                      className="bg-[#8B7355] hover:bg-[#6B5B4E] text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
                    >
                      Join Game
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#8B7355] mb-2">
                      No Active Games
                    </h3>
                    <p className="mb-4 text-[#6B5B4E]">
                      Create a new game and wait for others to join!
                    </p>
                    <button
                      onClick={handleCreateGame}
                      className="bg-[#8B7355] hover:bg-[#6B5B4E] text-white font-bold py-3 px-8 rounded-xl transition-colors shadow-lg"
                    >
                      Create New Game
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[350px]">
                <Image
                  src="/lens-logo.svg"
                  alt="Lens Logo"
                  width={96}
                  height={96}
                  className="w-24 h-24 mb-4 opacity-80"
                />
                <div className="text-5xl mb-2">😢</div>
                <h2 className="text-2xl font-bold text-[#8B7355] mb-2">
                  Ohhh little boy...
                </h2>
                <p className="text-[#6B5B4E] mb-4">
                  You don&apos;t have a Lens ID yet!
                </p>
                <a
                  href="https://claim.lens.xyz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-[#8B7355] hover:bg-[#6B5B4E] text-white font-bold py-2 px-8 rounded-xl transition-colors shadow"
                >
                  Get Your Lens ID Now
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Quick Rules Section */}
        <div className="mt-8 bg-white p-6 rounded-lg border-2 border-[#D4C4B7] shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-[#8B7355]">
            Quick Rules
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#8B7355]">
                Game Phases
              </h3>
              <ul className="list-disc list-inside text-[#6B5B4E] space-y-2">
                <li>
                  Night: Wolves hunt, Detective investigates, Doctor protects
                </li>
                <li>Day: Discuss and vote to eliminate suspicious players</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2 text-[#8B7355]">
                Winning Conditions
              </h3>
              <ul className="list-disc list-inside text-[#6B5B4E] space-y-2">
                <li>Villagers win when all wolves are eliminated</li>
                <li>Wolves win when they equal or outnumber villagers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
