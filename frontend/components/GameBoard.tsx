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
      <div className="players-grid">
        {players.map((player) => (
          <div key={player.id} className="player-card">
            <h3>{player.name}</h3>
            <p>Role: {roles[player.id] || "Unknown"}</p>
          </div>
        ))}
      </div>
      <div className="timer">Time Left: {timeLeft}s</div>
    </div>
  );
};

export default GameBoard;
