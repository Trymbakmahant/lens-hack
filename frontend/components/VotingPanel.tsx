"use client";

import React, { useState } from "react";

interface VotingPanelProps {
  players: { id: string; name: string }[];
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
      <h2 className="text-2xl font-bold mb-2">Voting Phase</h2>
      <div className="text-sm text-gray-400 mb-4">Time Left: {timeLeft}s</div>
      <div className="space-y-3">
        {players.map((player) => (
          <button
            key={player.id}
            className={`w-full p-3 rounded-lg transition-all duration-200 ${
              selectedPlayer === player.id
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-gray-700 hover:bg-gray-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
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
