"use client";

import React from "react";

interface GameBoardProps {
  players: any[];
  roles: Record<string, string>;
  timeLeft: number;
}

const GameBoard: React.FC<GameBoardProps> = ({ players, roles, timeLeft }) => {
  return (
    <div className="game-board">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">Game Board</h2>
        <div className="text-sm text-gray-400">Time Left: {timeLeft}s</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {players.map((player) => (
          <div
            key={player.id}
            className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors duration-200"
          >
            <h3 className="font-semibold text-lg mb-2">{player.name}</h3>
            <p className="text-sm text-gray-300">
              Role: {roles[player.id] || "Unknown"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
