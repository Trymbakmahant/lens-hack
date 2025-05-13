"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/store/gameStore";

export default function ResultsPage() {
  const router = useRouter();
  const { players, resetGame } = useGameStore();

  const handlePlayAgain = () => {
    resetGame();
    router.push("/lobby");
  };

  const winners = players.filter((player) => player.isAlive);
  const losers = players.filter((player) => !player.isAlive);

  return (
    <div className="results-container">
      <h1>Game Results</h1>

      <div className="results-summary">
        <div className="winners">
          <h2>Winners</h2>
          <ul>
            {winners.map((player) => (
              <li key={player.id}>
                {player.name} - {player.role}
              </li>
            ))}
          </ul>
        </div>

        <div className="losers">
          <h2>Eliminated Players</h2>
          <ul>
            {losers.map((player) => (
              <li key={player.id}>
                {player.name} - {player.role}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rewards">
        <h2>Rewards</h2>
        <p>Winners will receive their rewards shortly...</p>
      </div>

      <div className="actions">
        <button onClick={handlePlayAgain} className="play-again-button">
          Play Again
        </button>
      </div>
    </div>
  );
}
