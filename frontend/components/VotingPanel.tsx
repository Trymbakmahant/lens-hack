"use client";

import React, { useState } from "react";

interface VotingPanelProps {
  players: any[];
  onVote: (playerId: string) => void;
  timeLeft: number;
}

const VotingPanel: React.FC<VotingPanelProps> = ({
  players,
  onVote,
  timeLeft,
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const handleVote = (playerId: string) => {
    setSelectedPlayer(playerId);
    onVote(playerId);
  };

  return (
    <div className="voting-panel">
      <h2>Voting Phase</h2>
      <div className="timer">Time Left: {timeLeft}s</div>
      <div className="players-list">
        {players.map((player) => (
          <button
            key={player.id}
            className={`vote-button ${
              selectedPlayer === player.id ? "selected" : ""
            }`}
            onClick={() => handleVote(player.id)}
            disabled={selectedPlayer !== null}
          >
            {player.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VotingPanel;
