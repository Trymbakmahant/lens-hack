"use client";

import React, { useState } from "react";

interface NightActionsProps {
  role: string;
  players: any[];
  onAction: (targetId: string) => void;
  timeLeft: number;
}

const NightActions: React.FC<NightActionsProps> = ({
  role,
  players,
  onAction,
  timeLeft,
}) => {
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);

  const handleAction = (targetId: string) => {
    setSelectedTarget(targetId);
    onAction(targetId);
  };

  const getActionDescription = () => {
    switch (role) {
      case "werewolf":
        return "Choose a player to eliminate";
      case "detective":
        return "Choose a player to investigate";
      default:
        return "Waiting for your action...";
    }
  };

  return (
    <div className="night-actions">
      <h2>Night Phase - {role.charAt(0).toUpperCase() + role.slice(1)}</h2>
      <div className="timer">Time Left: {timeLeft}s</div>
      <p className="action-description">{getActionDescription()}</p>
      <div className="targets-list">
        {players.map((player) => (
          <button
            key={player.id}
            className={`action-button ${
              selectedTarget === player.id ? "selected" : ""
            }`}
            onClick={() => handleAction(player.id)}
            disabled={selectedTarget !== null}
          >
            {player.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NightActions;
