"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useGameStore } from "@/store/gameStore";

export default function GameLobby() {
  const params = useParams();
  const router = useRouter();
  const { address } = useAccount();
  const gameId = params.gameId as string;
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [revealTime, setRevealTime] = useState<number | null>(null);
  const [isWherewolf, setIsWherewolf] = useState<boolean | null>(null);
  const { phase, players, yourRole, setPhase, setPlayers, setYourRole } =
    useGameStore();

  useEffect(() => {
    // Initialize WebSocket connection
    const websocket = new WebSocket(
      `ws://localhost:8080/ws/game?gameId=${gameId}`
    );

    websocket.onopen = () => {
      console.log("WebSocket Connected");
      // Send join game message
      websocket.send(
        JSON.stringify({
          type: "join_game",
          gameId,
          address,
          username: localStorage.getItem("username") || "Anonymous",
        })
      );
    };

    websocket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "game_state") {
        setPhase(data.game.phase);
        setPlayers(data.game.players);
        setRevealTime(data.game.revealTime);
        setIsWherewolf(data.game.isWherewolf);

        // If game has started, get player's role
        if (data.game.phase !== "JOINING" && address) {
          const playerUuid = localStorage.getItem("playerUuid");
          if (playerUuid) {
            const startResponse = await fetch(
              `http://localhost:8080/api/game/start/${gameId}`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ address, playerUuid }),
              }
            );
            const startData = await startResponse.json();
            if (startData.yourRole) {
              setYourRole(startData.yourRole);
            }
          }
        }
        setIsLoading(false);
      } else if (data.type === "error") {
        setErrorMessage(data.message);
        setIsLoading(false);
      }
    };

    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
      setErrorMessage("Failed to connect to game server");
      setIsLoading(false);
    };

    websocket.onclose = () => {
      console.log("WebSocket Disconnected");
    };

    // Cleanup on unmount
    return () => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.close();
      }
    };
  }, [gameId, address, setPhase, setPlayers, setYourRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF5E6] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#8B7355]"></div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-[#FFF5E6] flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h2 className="text-2xl font-bold text-[#8B7355] mb-4">Error</h2>
          <p className="text-[#6B5B4E]">{errorMessage}</p>
          <button
            onClick={() => router.push("/lobby")}
            className="mt-4 bg-[#8B7355] hover:bg-[#6B5B4E] text-white font-bold py-2 px-4 rounded-lg"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF5E6] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-[#EADBC8]">
          <h1 className="text-3xl font-bold text-[#8B7355] mb-6">Game Room</h1>

          {phase === "JOINING" ? (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#8B7355] mb-4">
                Waiting for Players
              </h2>
              <p className="text-[#6B5B4E] mb-4">
                Current Players:{" "}
                {typeof players === "number" ? players : players.length} / 3
              </p>
              <div className="animate-pulse text-5xl mb-4">🎮</div>
              <p className="text-[#6B5B4E]">
                The game will start automatically when all players join
              </p>
            </div>
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-[#8B7355] mb-4">
                Game in Progress
              </h2>
              <p className="text-[#6B5B4E] mb-4">
                Your Role: {yourRole || "Loading..."}
              </p>
              <p className="text-[#6B5B4E] mb-4">Phase: {phase}</p>
              {revealTime && (
                <p className="text-[#6B5B4E] mb-4">
                  Reveal Time:{" "}
                  {new Date(revealTime * 1000).toLocaleTimeString()}
                </p>
              )}
              {isWherewolf !== null && (
                <p className="text-[#6B5B4E] mb-4">
                  You are {isWherewolf ? "the Werewolf" : "a Villager"}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
