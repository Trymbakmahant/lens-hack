"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import WalletConnect from "@/components/WalletConnect";

export default function LobbyPage() {
  const router = useRouter();
  const [gameId, setGameId] = useState("");
  const [playerName, setPlayerName] = useState("");

  const handleCreateGame = () => {
    // Generate a random game ID
    const newGameId = Math.random().toString(36).substring(2, 8);
    router.push(`/game/${newGameId}`);
  };

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameId && playerName) {
      router.push(`/game/${gameId}`);
    }
  };

  return (
    <div className="lobby-container">
      <h1>Werewolf Game Lobby</h1>

      <div className="wallet-section">
        <WalletConnect
          onConnect={(address) => console.log("Connected:", address)}
        />
      </div>

      <div className="game-options">
        <div className="create-game">
          <h2>Create New Game</h2>
          <button onClick={handleCreateGame} className="create-button">
            Create Game
          </button>
        </div>

        <div className="join-game">
          <h2>Join Existing Game</h2>
          <form onSubmit={handleJoinGame}>
            <input
              type="text"
              placeholder="Enter Game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              required
            />
            <button type="submit" className="join-button">
              Join Game
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
