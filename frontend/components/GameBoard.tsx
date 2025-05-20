"use client";

import React from "react";

interface Player {
  id: string;
  name: string;
  role: string;
  isAlive: boolean;
  votes?: number;
  isWherewolf?: boolean;
}

interface GameBoardProps {
  players: Player[];
  roles: Record<string, string>;
  timeLeft: number;
  phase: "day" | "night";
  revealTime?: number | null;
}

const GameBoard: React.FC<GameBoardProps> = ({
  players,
  roles,
  timeLeft,
  phase,
  revealTime,
}) => {
  return (
    <div className="game-board">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Game Board</h2>
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-400">Time Left: {timeLeft}s</div>
          <div
            className={`text-sm px-3 py-1 rounded-full ${
              phase === "day"
                ? "bg-yellow-500 text-black"
                : "bg-blue-900 text-white"
            }`}
          >
            {phase.charAt(0).toUpperCase() + phase.slice(1)} Phase
          </div>
        </div>
        {revealTime && (
          <div className="text-sm text-gray-400 mt-2">
            Reveal Time: {new Date(revealTime * 1000).toLocaleTimeString()}
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <div
            key={player.id}
            className={`rounded-lg p-4 transition-colors duration-200 ${
              player.isAlive
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-800 opacity-50"
            }`}
          >
            <h3 className="font-semibold text-lg mb-2">{player.name}</h3>
            <p className="text-sm text-gray-300">
              Role: {roles[player.id] || "Unknown"}
            </p>
            {player.isWherewolf && (
              <p className="text-sm text-red-400 mt-2">Werewolf</p>
            )}
            {player.votes !== undefined && player.votes > 0 && (
              <p className="text-sm text-yellow-400 mt-2">
                Votes: {player.votes}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
